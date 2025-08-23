// Genkit configuration for ALCHM AI flows
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { googleAI } from '@genkit-ai/googleai';

// Configure Genkit with Firebase and Google AI
export const ai = configureGenkit({
  plugins: [
    firebase(),
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

// Export commonly used models
export { gemini15Flash, gemini15Pro } from '@genkit-ai/googleai';