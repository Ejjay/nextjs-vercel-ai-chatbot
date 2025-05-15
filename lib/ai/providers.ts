import { google } from '@ai-sdk/google';
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';

// Initialize with API key from environment variables
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set');
}

// Create a custom Google provider instance for Gemini Pro with safety settings
const googleProvider = google('gemini-1.5-pro-latest', {
  safetySettings: [
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE'
    }
  ]
});

// Export provider configuration with individual models:
// - "chat-model": Default Gemini Pro for standard chat interactions
// - "chat-model-reasoning": Gemini Pro with added thinking capabilities
// - "gemini-model": Gemini Flash configured for fast responses
export const myProvider = {
  languageModels: {
    'chat-model': googleProvider,
    'chat-model-reasoning': google('gemini-1.5-pro-latest', {
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 2048
          }
        } satisfies GoogleGenerativeAIProviderOptions
      }
    }),
    'gemini-model': google('gemini-1.5-flash', {
      providerOptions: {
        google: {
          responseModalities: ['TEXT']
        } satisfies GoogleGenerativeAIProviderOptions
      }
    })
  }
};