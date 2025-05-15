import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  type LanguageModelV1CallOptions,
  type LanguageModelV1Message
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI client
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error('GOOGLE_API_KEY environment variable is not set');
const genAI = new GoogleGenerativeAI(apiKey);

const geminiModelImplementation = {
  specificationVersion: 'v1' as const,
  provider: 'google' as const,
  modelId: 'gemini-1.5-flash',
  defaultObjectGenerationMode: 'tool' as const,
  async doGenerate(options: LanguageModelV1CallOptions) {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    });

    // Properly typed message conversion
    const contents = (options.input as LanguageModelV1Message[]).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const result = await model.generateContent({ contents });
    return {
      text: await result.response.text(),
      finishReason: 'stop',
      usage: { promptTokens: 0, completionTokens: 0 }
    };
  },
  async doStream() {
    throw new Error('Streaming not implemented');
  }
};

export const myProvider = customProvider({
  languageModels: {
    'chat-model': xai('grok-2-vision-1212'),
    'chat-model-reasoning': wrapLanguageModel({
      model: xai('grok-3-mini-beta'),
      middleware: extractReasoningMiddleware({ tagName: 'think' })
    }),
    'gemini-model': wrapLanguageModel({
      model: geminiModelImplementation,
      middleware: []
    })
  },
  imageModels: {
    'small-model': xai.image('grok-2-image')
  }
});