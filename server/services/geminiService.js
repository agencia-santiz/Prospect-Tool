import { GoogleGenAI, Type } from '@google/genai';
import { SEGMENT_DATABASE } from '../../src/utils/segmentDatabase.js';

const ALLOWED_SEGMENTS = SEGMENT_DATABASE.map(s => s.label);


const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (character) => {
    const random = Math.random() * 16 | 0;
    const value = character === 'x' ? random : (random & 0x3 | 0x8);
    return value.toString(16);
  });
};

const cleanJson = (text) => {
  let cleaned = String(text || '').replace(/```json/g, '').replace(/```/g, '');

  const startIndex = cleaned.indexOf('[');
  const endIndex = cleaned.lastIndexOf(']');

  if (startIndex !== -1 && endIndex !== -1) {
    return cleaned.substring(startIndex, endIndex + 1);
  }

  const startObj = cleaned.indexOf('{');
  const endObj = cleaned.lastIndexOf('}');
  if (startObj !== -1 && endObj !== -1) {
    return `[${cleaned.substring(startObj, endObj + 1)}]`;
  }

  return '[]';
};

const normalizeFetchArgs = (locationOrArgs, segment, excludeNames, quantity) => {
  if (locationOrArgs && typeof locationOrArgs === 'object' && !Array.isArray(locationOrArgs)) {
    return {
      location: String(locationOrArgs.location || '').trim(),
      segment: String(locationOrArgs.segment || '').trim(),
      excludeNames: Array.isArray(locationOrArgs.excludeNames) ? locationOrArgs.excludeNames : [],
      quantity: Number.isFinite(Number(locationOrArgs.quantity)) ? Number(locationOrArgs.quantity) : 9,
    };
  }

  return {
    location: String(locationOrArgs || '').trim(),
    segment: String(segment || '').trim(),
    excludeNames: Array.isArray(excludeNames) ? excludeNames : [],
    quantity: Number.isFinite(Number(quantity)) ? Number(quantity) : 9,
  };
};

export const createGeminiLeadService = (env = process.env) => {
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      fetchEnrichedLeads: async () => {
        const error = new Error('GEMINI_API_KEY is not configured on the backend');
        error.code = 'MISSING_GEMINI_API_KEY';
        throw error;
      },
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const refineSearchQuery = async (segment) => {
    if (!apiKey) return segment;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = 'gemini-1.5-flash';
      
      const prompt = `
        Task: Expand the search term "${segment}" into a list of related B2B business categories/synonyms to improve Google Maps search results.
        Context: The user is looking for companies to sell products/services to.
        
        Rules:
        - If it's specific like "Dentista", return "Dentistas, Clínicas Odontológicas".
        - If it's broad like "Lanche", return "Lanchonetes, Hamburguerias, Fast Food, Hot Dogs, Cafeterias, Salgaderias".
        - Return ONLY the list of synonyms separated by commas.
        - No intro, no explanations.
        - Max 12 synonyms.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.3,
        }
      });

      const result = (response.text || '').trim();
      return result || segment;
    } catch (e) {
      console.warn('Failed to refine search query with Gemini:', e.message);
      return segment;
    }
  };

  const fetchEnrichedLeads = async (locationOrArgs, segment, excludeNames = [], quantity = 9) => {
    const {
      location,
      segment: resolvedSegment,
      excludeNames: resolvedExcludeNames,
      quantity: resolvedQuantity,
    } = normalizeFetchArgs(locationOrArgs, segment, excludeNames, quantity);

    const model = 'gemini-2.5-flash';
    const isBrazil = location.includes(' - SP') || location.includes(' - RJ') || location.includes(' - BR') || !location.includes(' - ');
    const exclusionList = resolvedExcludeNames.slice(-50).join(', ');
    const exclusionPrompt = exclusionList.length > 0
      ? `EXCLUDE these companies (already known): [${exclusionList}]. Find others.`
      : '';

    const prompt = `
      Task: Find B2B leads for "${resolvedSegment}" in "${location}".
      Target: Up to ${resolvedQuantity} businesses.

      INSTRUCTIONS:
      1. USE 'googleMaps' to search. This is mandatory.
      2. List businesses found. If exact category matches are low, include closely related businesses.
      3. ${exclusionPrompt}
      
      Important:
      - Do not invent data. Use real Maps data.
      - If available in Google Maps, include the place rating and review count.
      - If you find fewer than ${resolvedQuantity}, return all you found.
    `;

    const responseSchema = {
      type: Type.ARRAY,
      description: 'List of B2B leads found in Google Maps.',
      items: {
        type: Type.OBJECT,
        properties: {
          nome_fantasia: { type: Type.STRING, description: 'Business Name' },
          endereco: { type: Type.STRING, description: 'Full Address' },
          telefone: { type: Type.STRING, description: 'Phone (or null)', nullable: true },
          website: { type: Type.STRING, description: 'Website URL (or null)', nullable: true },
          atividade: { 
            type: Type.STRING, 
            description: 'Primary Category from our official taxonomy.',
            enum: ALLOWED_SEGMENTS
          },
          horario_funcionamento: { type: Type.STRING, description: 'e.g., Seg-Sex 08-18h (or null)', nullable: true },
          aberto_agora: { type: Type.BOOLEAN, nullable: true },
          rating: { type: Type.NUMBER, description: 'Google rating from 0 to 5 (or null)', nullable: true },
          userRatingsTotal: { type: Type.INTEGER, description: 'Total number of Google reviews (or null)', nullable: true },
          google_maps_url: { type: Type.STRING, description: 'Direct link to the place on Google Maps' },
          resumo_relevancia: { type: Type.STRING, description: 'A short sentence explaining why this lead is relevant for the target segment, including any specific evidence like rating, popularity or services.' }
        },
        required: ['nome_fantasia', 'endereco', 'atividade', 'google_maps_url', 'resumo_relevancia']
      }
    };

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          temperature: 0.5,
          responseMimeType: 'application/json',
          responseSchema: responseSchema
        },
      });

      let rawData = [];

      try {
        rawData = JSON.parse(response.text || '[]');
      } catch (parseError) {
        console.warn('Failed to parse JSON from Gemini, raw text snippet:', response.text?.substring(0, 100));
        return [];
      }

      if (!Array.isArray(rawData)) {
        return [];
      }

      return rawData.map((item) => {
        let cityStr = location;
        let ufStr = '';
        if (location.includes('-')) {
          const parts = location.split('-');
          cityStr = parts[0].trim();
          ufStr = parts[1].trim();
        }

        let cleanWebsite = item.website;
        if (cleanWebsite) {
          cleanWebsite = cleanWebsite.replace(/^https?:\/\//, '').replace(/^www\./, '');
          if (cleanWebsite.endsWith('/')) cleanWebsite = cleanWebsite.slice(0, -1);
          if (cleanWebsite === 'null' || cleanWebsite === '') cleanWebsite = null;
        }

        const fullAddress = item.endereco || `${cityStr}, ${ufStr}`;
        const bairroMatch = fullAddress.match(/,\s*([^,]+),\s*[A-Z]{2}/);
        const bairro = bairroMatch ? bairroMatch[1] : (item.bairro || 'Centro');

        return {
          id: generateUUID(),
          cnpj: '',
          ['raz\u00e3o_social']: item.razao_social || item.nome_fantasia,
          nome_fantasia: item.nome_fantasia,
          endereco: fullAddress,
          cidade: cityStr,
          uf: ufStr,
          pais: isBrazil ? 'Brasil' : 'Exterior',
          bairro,
          cep: '',
          opening_hours: item.horario_funcionamento || 'Hor\u00e1rio Comercial',
          is_open_now: item.aberto_agora !== undefined ? item.aberto_agora : false,
          atividade_principal: item.atividade || resolvedSegment,
          telefone: item.telefone || null,
          email: null,
          website: cleanWebsite || null,
          status: 'NEW',
          source: 'GOOGLE_MAPS',
          score: 85,
          rating: typeof item.rating === 'number' ? item.rating : undefined,
          userRatingsTotal: Number.isFinite(Number(item.userRatingsTotal)) ? Number(item.userRatingsTotal) : undefined,
          relevance_summary: item.resumo_relevancia || `Possível oportunidade para ${resolvedSegment} em ${cityStr}.`,
          googleMapsUri: item.google_maps_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.nome_fantasia}, ${item.endereco || cityStr}`)}`,
          socials: {
            linkedin: undefined,
            instagram: undefined,
            facebook: undefined,
          },
        };
      });
    } catch (error) {
      console.error('Gemini Generation Error:', error);
      return [];
    }
  };

  return { fetchEnrichedLeads };
};
