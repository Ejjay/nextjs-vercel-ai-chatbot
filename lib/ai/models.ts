export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Gemini 1.5 Flash',
    description: "Google's fastest and most efficient model for chat",
  },
  {
    id: 'chat-model-reasoning',
    name: 'Gemini 1.5 Flash Reasoning',
    description: 'Uses advanced reasoning with Gemini 1.5 Flash',
  },
];