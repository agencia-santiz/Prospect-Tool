import { GoogleGenAI } from '@google/genai';

async function testGemini() {
  const apiKey = 'AIzaSyA53aZCKxWxBSDIlAXt4kRNPKvawGMXU0E'; // From user's .env
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Test',
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    console.log(response.text);
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testGemini();
