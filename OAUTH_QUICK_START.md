# Quick Start: OAuth Setup (5 minutes)

## Google OAuth (Fastest)

### 1. Get Credentials
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create project → Enable Calendar API → Create OAuth Web Credentials
- Redirect URI: `http://localhost:5000/api/auth/google/callback`

### 2. Update Backend
```bash
cd backend
echo "GOOGLE_CLIENT_ID=your_id" >> .env
echo "GOOGLE_CLIENT_SECRET=your_secret" >> .env
echo "GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback" >> .env
```

### 3. Start & Test
```bash
npm run dev
# Go to http://localhost:3000/oauth-login
# Click "Login with Google"
```

---

## Microsoft OAuth

### 1. Get Credentials
- Go to [Azure Portal](https://portal.azure.com/) → App Registrations
- New registration → Add redirect URI: `http://localhost:5000/api/auth/microsoft/callback`
- Certificates & secrets → New client secret
- API permissions → Add `Calendars.ReadWrite`

### 2. Update Backend
```bash
cd backend
echo "MICROSOFT_CLIENT_ID=your_id" >> .env
echo "MICROSOFT_CLIENT_SECRET=your_secret" >> .env
echo "MICROSOFT_REDIRECT_URI=http://localhost:5000/api/auth/microsoft/callback" >> .env
```

### 3. Start & Test
```bash
npm run dev
# Go to http://localhost:3000/oauth-login
# Click "Login with Microsoft"
```

---

## Full Details

See [OAUTH_SETUP.md](OAUTH_SETUP.md) for detailed step-by-step instructions.

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Redirect URI mismatch | Ensure URI matches exactly in provider settings |
| Invalid Client ID | Check Client ID/Secret are correct |
| Permission denied | Grant Calendar.ReadWrite permissions |
| Token invalid | Make sure offline_access scope is enabled |

---

## API Endpoints

### Get Auth URL
```
GET /api/auth/google/url
GET /api/auth/microsoft/url

Response: { "authUrl": "https://..." }
```

### OAuth Callback (Automatic)
```
GET /api/auth/google/callback?code=xxx&state=xxx
GET /api/auth/microsoft/callback?code=xxx&state=xxx

Redirects to: http://localhost:3000/dashboard?token=jwt_token
```

---

## Next: Deployment

Once OAuth is working locally, follow [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production.
