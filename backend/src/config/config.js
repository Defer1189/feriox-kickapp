import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // KICK OAuth2 configuration
  KICK_CLIENT_ID: process.env.KICK_CLIENT_ID,
  KICK_CLIENT_SECRET: process.env.KICK_CLIENT_SECRET,
  KICK_REDIRECT_URI: process.env.KICK_REDIRECT_URI || 'http://localhost:3001/api/auth/callback',
  
  // KICK API URLs
  KICK_AUTHORIZE_URL: 'https://id.kick.com/oauth/authorize',
  KICK_TOKEN_URL: 'https://id.kick.com/oauth/token',
  KICK_API_BASE_URL: 'https://kick.com/api/v2',
  
  // OAuth2 Scopes
  KICK_SCOPES: [
    'user:read',
    'channel:read',
    'channel:write',
    'chat:write',
    'streamkey:read',
    'events:subscribe',
    'moderation:ban'
  ],
  
  // Cookie configuration
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'your-secret-key-change-in-production',
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Session configuration
  SESSION_COOKIE_NAME: 'kick_session',
  STATE_COOKIE_NAME: 'oauth_state'
};

// Validate required environment variables
export function validateConfig() {
  const required = ['KICK_CLIENT_ID', 'KICK_CLIENT_SECRET'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
