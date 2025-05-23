import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

// Initialize with API key from environment variables
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
}

export const myProvider = {
  languageModels: {
    'chat-model': google('gemini-1.5-flash', {
      safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    }),
    'chat-model-reasoning': google('gemini-1.5-flash', {
    }),
    'gemini-model': google('gemini-1.5-flash'),
    'artifact-model': google('gemini-1.5-flash')
  }
};