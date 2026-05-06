
interface IBGEMunicipality {
  id: number;
  nome: string;
  microrregiao?: {
    mesorregiao?: {
      UF?: {
        sigla: string;
      };
    };
  };
}

interface RestCountry {
  name: { common: string };
  capital?: string[];
  cca2: string;
}

export interface CityOption {
  label: string; // "São Paulo - SP" or "Paris - France"
  value: string;
}

const CACHE_KEY = 'nexus_cities_cache_v5';

// Fallback in case both APIs fail
const FALLBACK_CITIES: CityOption[] = [
    { label: "São Paulo - SP", value: "São Paulo - SP" },
    { label: "New York - USA", value: "New York - USA" },
    { label: "London - UK", value: "London - UK" },
    { label: "Tokyo - Japan", value: "Tokyo - Japan" },
    { label: "Paris - France", value: "Paris - France" },
    { label: "Rio de Janeiro - RJ", value: "Rio de Janeiro - RJ" },
];

export const fetchBrazilianCities = async (): Promise<CityOption[]> => {
  // Check local storage first
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    // console.log("Loaded cities from cache");
    return JSON.parse(cached);
  }

  try {
    const allOptions: CityOption[] = [];

    // 1. Fetch ALL Global Countries and Capitals
    try {
        const responseGlobal = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,cca2');
        if (responseGlobal.ok) {
            const countries: RestCountry[] = await responseGlobal.json();
            countries.forEach(c => {
                // Add Country itself
                allOptions.push({
                    label: `${c.name.common}`,
                    value: `${c.name.common}`
                });
                
                // Add Capital if exists
                if (c.capital && c.capital.length > 0) {
                    allOptions.push({
                        label: `${c.capital[0]} - ${c.name.common}`,
                        value: `${c.capital[0]} - ${c.name.common}`
                    });
                }
            });
        }
    } catch (e) {
        console.warn("Failed to fetch global countries", e);
    }

    // 2. Fetch Brazilian Municipalities (IBGE)
    try {
        const responseIBGE = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        if (responseIBGE.ok) {
             const data: IBGEMunicipality[] = await responseIBGE.json();
             const brCities = data
                .filter(city => city?.microrregiao?.mesorregiao?.UF?.sigla)
                .map(city => ({
                    label: `${city.nome} - ${city.microrregiao!.mesorregiao!.UF!.sigla}`,
                    value: `${city.nome} - ${city.microrregiao!.mesorregiao!.UF!.sigla}`
                }));
             allOptions.push(...brCities);
        }
    } catch (e) {
        console.warn("Failed to fetch IBGE", e);
    }

    // Remove duplicates and sort
    const uniqueOptions = Array.from(new Map(allOptions.map(item => [item.label, item])).values());
    uniqueOptions.sort((a, b) => a.label.localeCompare(b.label));

    if (uniqueOptions.length === 0) {
        throw new Error("No cities fetched");
    }

    // Cache the result
    localStorage.setItem(CACHE_KEY, JSON.stringify(uniqueOptions));
    
    return uniqueOptions;
  } catch (error) {
    console.error("Failed to fetch cities, using fallback:", error);
    return FALLBACK_CITIES;
  }
};