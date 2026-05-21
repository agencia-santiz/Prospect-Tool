import { getBackendBaseUrl } from '../utils/backendUrl.js';

const BACKEND_BASE_URL = getBackendBaseUrl();

export type FeedbackType = 'bom_lead' | 'duplicado' | 'fora_cidade' | 'fora_segmento' | 'sem_contato';

export const sendLeadFeedback = async (
  leadId: string,
  feedbackType: FeedbackType,
  context?: {
    companyName?: string;
    segment?: string;
    city?: string;
    searchId?: string;
  }
): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/search/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        leadId,
        feedbackType,
        companyName: context?.companyName || '',
        segment: context?.segment || '',
        city: context?.city || '',
        searchId: context?.searchId || '',
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send lead feedback:', error);
    return false;
  }
};
