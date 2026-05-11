export type ModelProviderName = 'openai' | 'anthropic';

export type ModelTextRequest = {
  system: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'khepera_json';
};

export type ModelTextResponse = {
  text: string;
  provider: ModelProviderName;
  model: string;
};

export type ModelProviderRequest = ModelTextRequest & {
  model?: string;
  abortSignal?: AbortSignal;
  inputTextForSafety?: string;
};

export type GuardedModelTextResponse =
  | { blockedByCrisis: true; text: null; provider: null; model: null }
  | ({ blockedByCrisis: false } & ModelTextResponse);
