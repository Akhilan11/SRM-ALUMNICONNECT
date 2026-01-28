/**
 * Chatbot API Route
 * Handles AI-powered alumni assistant queries
 */
import express from 'express';
import OpenAI from 'openai/index.mjs';
import { config } from '../config/index.js';
import { fetchAllChatbotData } from '../services/firebase.js';
import { buildContext } from '../utils/formatters.js';

const router = express.Router();

/**
 * System prompt for the AI assistant
 */
const SYSTEM_PROMPT = `You are an AI Alumni Assistant. Present data clearly in HTML, 
using light-themed cards, bold text, emojis, and line breaks. Be polite and conversational.
When displaying lists, use well-formatted HTML with proper styling.`;

/**
 * POST /api/chatbot
 * Process user message and return AI response
 */
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize OpenAI client
    const client = new OpenAI({ apiKey: config.openai.apiKey });

    // Fetch all relevant data from Firestore
    const data = await fetchAllChatbotData();

    // Build HTML context for AI
    const context = buildContext(data);

    // Send to OpenAI
    const response = await client.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Alumni database:\n${context}\n\nUser question: ${message}`,
        },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({ error: 'Error contacting AI' });
  }
});

export default router;
