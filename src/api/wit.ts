import axios from 'axios';

const WIT_SERVER_ACCESS_TOKEN = 'GB2JQ3K42XAJGBQY7EGVESOR26B4H65T';

interface WitResponse {
  text: string;
  intents: Array<{
    name: string;
    confidence: number;
  }>;
  entities: Record<string, Array<{
    name: string;
    confidence: number;
    value: string;
  }>>;
  traits: Record<string, Array<{
    name: string;
    confidence: number;
    value: string;
  }>>;
}

export async function analyzeEmotion(userMessage: string): Promise<WitResponse> {
  try {
    const response = await axios.get('https://api.wit.ai/message', {
      headers: {
        'Authorization': `Bearer ${WIT_SERVER_ACCESS_TOKEN}`
      },
      params: {
        q: userMessage
      }
    });

    return response.data;
  } catch (error) {
    console.error('Wit.ai API error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze emotion');
  }
} 