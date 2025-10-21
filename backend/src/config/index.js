import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // KICK OAuth2
  kick: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
    authUrl: 'https://id.kick.com/oauth/authorize',
    tokenUrl: 'https://id.kick.com/oauth/token',
    apiBaseUrl: 'https://api.kick.com',
    scopes: [
      'user:read',
      'channel:read',
      'channel:write',
      'chat:write',
      'streamkey:read',
      'events:subscribe',
      'moderation:ban'
    ]
  },

  // Cookies & Sessions
  cookieSecret: process.env.COOKIE_SECRET || 'default-secret-change-in-production',
  sessionExpiry: parseInt(process.env.SESSION_EXPIRY) || 3600000 // 1 hour
};

// Validate required environment variables
export function validateConfig() {
  const required = ['CLIENT_ID', 'CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Warning: Missing environment variables: ${missing.join(', ')}`);
    console.warn('Please copy .env.example to .env and fill in your credentials');
  }

  return missing.length === 0;
}
