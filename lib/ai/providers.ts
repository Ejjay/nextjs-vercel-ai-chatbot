import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  createLanguageModelV1,
  type LanguageModelV1
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI client
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY environment variable is not set');
}
const genAI = new GoogleGenerativeAI(apiKey);

// Create Gemini language model adapter
const geminiModel: LanguageModelV1 = createLanguageModelV1({
  modelId: 'gemini-1.5-flash',
  providerIdentifier: 'google',
  async doGenerate(options) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: options.temperature,
          topK: options.topK,
          topP: options.topP,
          maxOutputTokens: options.maxTokens
        }
      });

      // Convert messages to Gemini format
      const contents = options.messages.map(message => ({
        role: message.role === 'user' ? 'user' : 'model',
        parts: [{ text: message.content }]
      }));

      const result = await model.generateContent({
        contents,
        tools: options.tools?.map(tool => ({
          functionDeclarations: [tool]
        }))
      });

      const response = await result.response;
      
      return {
        text: response.text(),
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0
        },
        finishReason: response.usageMetadata?.finishReason || 'stop'
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }
});

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-2-1212'),
        'artifact-model': xai('grok-2-1212'),
        'gemini-model': geminiModel
      },
      imageModels: {
        'small-model': xai.image('grok-2-image')
      },
    });