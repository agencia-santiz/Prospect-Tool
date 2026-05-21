import { Company } from "../types";
import { getBackendBaseUrl } from '../utils/backendUrl.js';

const BACKEND_BASE_URL = getBackendBaseUrl();
const FRONTEND_BACKEND_BASE_URL = String(import.meta.env.VITE_BACKEND_URL || BACKEND_BASE_URL).replace(/\/$/, '');

type GeminiBackendResponse = {
  leads?: Company[];
};

export const fetchEnrichedLeads = async (
  location: string,
  segment: string,
  excludeNames: string[] = [],
  quantity: number = 9,
  intent: string = 'NONE'
): Promise<Company[]> => {
  try {
    const response = await fetch(`${FRONTEND_BACKEND_BASE_URL}/search/enrich`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        segment,
        excludeNames,
        quantity,
        intent,
      }),
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as GeminiBackendResponse;
    if (!payload || !Array.isArray(payload.leads)) {
      return [];
    }

    return payload.leads;
  } catch (error) {
    console.error('Backend enriched lead fetch failed:', error);
    return [];
  }
};

export const exportLeadsToCsv = async (leads: Company[]): Promise<Blob | null> => {
  try {
    const response = await fetch(`${FRONTEND_BACKEND_BASE_URL}/export/csv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leads }),
    });

    if (!response.ok) {
      return null;
    }

    return await response.blob();
  } catch (error) {
    console.error('Failed to export leads to CSV:', error);
    return null;
  }
};
