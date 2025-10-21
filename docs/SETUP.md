# Setup Instructions

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- KICK Developer Account
- KICK OAuth2 Credentials (Client ID & Secret)

## Getting KICK API Credentials

1. Visit [KICK Developer Portal](https://kick.com/developer)
2. Create a new application
3. Set redirect URI to: `http://localhost:3000/api/auth/callback`
4. Note your Client ID and Client Secret
5. Configure the required scopes for your application

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Defer1189/feriox-kickapp.git
cd feriox-kickapp
```

### 2. Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Backend server
- Frontend application

### 3. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your credentials:

```env
# KICK OAuth2 Credentials
CLIENT_ID=your_kick_client_id_here
CLIENT_SECRET=your_kick_client_secret_here
REDIRECT_URI=http://localhost:3000/api/auth/callback

# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Cookie Configuration (generate a random secret)
COOKIE_SECRET=your_random_secure_cookie_secret_here_min_32_chars

# Session Configuration
SESSION_EXPIRY=3600000
```

**Generate a secure cookie secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Configure Frontend Environment

```bash
cd ../frontend
cp .env.example .env
```

The default configuration should work:
```env
VITE_API_URL=http://localhost:3000
```

## Running the Application

### Development Mode

#### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

#### Option 2: Use Root Scripts

From the root directory:

```bash
# Run backend
npm run dev:backend

# In another terminal, run frontend
npm run dev:frontend
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **API Info**: http://localhost:3000/api/info

## Testing the OAuth Flow

1. Open http://localhost:5173 in your browser
2. Click "Login with KICK" button
3. You'll be redirected to KICK's authorization page
4. Authorize the application
5. You'll be redirected back to the dashboard
6. Explore different scopes by expanding the cards

## Production Deployment

### Environment Variables

Update these for production:

**Backend (.env):**
```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
REDIRECT_URI=https://your-backend-domain.com/api/auth/callback
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.com
```

### Build Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

### Run Backend in Production

```bash
cd backend
npm start
```

Or use a process manager like PM2:

```bash
npm install -g pm2
pm2 start src/index.js --name kick-api-backend
```

## Troubleshooting

### "Missing environment variables" warning

Make sure you've copied `.env.example` to `.env` and filled in your KICK credentials.

### CORS errors

Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL exactly.

### OAuth callback fails

1. Verify `REDIRECT_URI` matches the one configured in KICK Developer Portal
2. Check that both backend and frontend are running
3. Clear browser cookies and try again

### Port already in use

Change the `PORT` in `backend/.env` to a different value (e.g., 3001)

### Cannot connect to backend

Ensure the backend is running and `VITE_API_URL` in frontend `.env` is correct.

## File Structure

```
feriox-kickapp/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── index.js        # Server entry point
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   ├── .env.example       # Environment template
│   └── package.json
├── docs/                  # Documentation
│   ├── API.md            # API documentation
│   ├── SETUP.md          # This file
│   └── SECURITY.md       # Security guidelines
└── package.json          # Root package.json
```

## Next Steps

- Read [API.md](./API.md) for detailed API documentation
- Review [SECURITY.md](./SECURITY.md) for security best practices
- Explore the code and customize for your needs
- Add more features and scopes as needed
