/**
 * Backend configuration
 */
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },

  // Firebase collections
  collections: {
    events: 'events',
    fundraising: 'fundraising',
    internships: 'internships',
    notifications: 'notifications',
    users: 'users',
    mentorship: 'mentorship',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
};

export default config;
