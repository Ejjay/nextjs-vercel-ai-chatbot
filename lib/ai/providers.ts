import { google } from '@ai-sdk/google';

// Initialize with API key from environment variables
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
}

export const myProvider = {
  languageModels: {
    'chat-model': google('gemini-1.5-pro-latest', {
      safetySettings: [{
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
      }]
    }),
    'chat-model-reasoning': google('gemini-1.5-pro-latest', {
      systemInstruction: {
        parts: [{ text: 'You are an AI assistant specialized in complex reasoning tasks' }]
      }
    }),
    'gemini-model': google('gemini-1.5-flash', {
      responseMimeType: 'text/plain'
    }),
    'artifact-model': google('gemini-1.5-pro-latest', {
      responseMimeType: 'application/json'
    })
  }
};