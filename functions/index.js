const functions = require('firebase-functions');
const admin = require('firebase-admin');
const next = require('next');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// ===== Firebase Admin Init =====
if (!admin.apps.length) {
  admin.initializeApp();
}

// ===== Gemini Setup =====
let GEMINI_API_KEY;

try {
  const config = functions.config();
  GEMINI_API_KEY = config.gemini?.api_key || process.env.GEMINI_API_KEY;
} catch (error) {
  console.error('Failed to get Gemini API key:', error);
}

// ===== NEXT.JS SSR SETUP =====
const nextjsServer = next({
  dev: false,
  conf: {
    distDir: '.next',
  },
});

const nextjsHandle = nextjsServer.getRequestHandler();

// ===== NEXT.JS SSR FUNCTION =====
exports.nextApp = functions
  .runWith({
    memory: '1GB',
    timeoutSeconds: 60,
  })
  .https.onRequest(async (req, res) => {
    console.log('NextApp function called for:', req.url);

    // Set CORS headers for all requests
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      await nextjsServer.prepare();
      return nextjsHandle(req, res);
    } catch (error) {
      console.error('NextApp error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// ===== EXISTING GEMINI FUNCTION =====
exports.chatWithGemini = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});
