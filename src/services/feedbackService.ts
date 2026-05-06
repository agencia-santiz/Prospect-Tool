const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8787';

export const sendLeadFeedback = async (
  leadId: string,
  feedbackType: 'bom_lead' | 'duplicado' | 'fora_cidade' | 'fora_segmento' | 'sem_contato',
  searchId?: string
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
        searchId,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send lead feedback:', error);
    return false;
  }
};
