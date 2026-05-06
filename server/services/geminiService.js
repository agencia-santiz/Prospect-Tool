import { GoogleGenAI } from '@google/genai';

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
        - Max 6 synonyms.
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

      OUTPUT FORMAT:
      Return strictly a JSON ARRAY of objects. No intro text.

      JSON Object Structure:
      {
        "nome_fantasia": "Business Name",
        "endereco": "Full Address",
        "telefone": "Phone (or null)",
        "website": "Website URL (or null)",
        "atividade": "Primary Category",
        "horario_funcionamento": "e.g., Seg-Sex 08-18h (or null)",
        "aberto_agora": true/false,
        "google_maps_url": "Direct link to the place on Google Maps"
      }

      Important:
      - Do not invent data. Use real Maps data.
      - If you find fewer than ${resolvedQuantity}, return all you found.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          temperature: 0.5,
        },
      });

      const cleanText = cleanJson(response.text || '');
      let rawData = [];

      try {
        rawData = JSON.parse(cleanText);
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
