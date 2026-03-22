# OAuth2 Setup Guide

This application supports authentication via Google Calendar and Microsoft Outlook 365.

## Prerequisites

- Existing Gmail/Google Workspace account
- Existing Microsoft 365 account
- Admin access to create OAuth applications

---

## Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: Click **Select a Project** → **New Project**
3. Enter project name: "Agenda Sync"
4. Click **Create**

### Step 2: Enable Calendar API

1. In the sidebar, go to **APIs & Services** → **Library**
2. Search for **"Google Calendar API"**
3. Click on it and press **Enable**

### Step 3: Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen first:
   - Click **Configure Consent Screen**
   - Select **External** user type
   - Fill in required fields (App name, Support email, etc.)
   - Save

4. Back to creating OAuth client ID:
   - Application type: **Web application**
   - Name: "Agenda Sync"
   - Authorized redirect URIs: Add `http://localhost:5000/api/auth/google/callback`
   - Click **Create**

5. Copy the **Client ID** and **Client Secret**

### Step 4: Add to Backend .env

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

---

## Microsoft OAuth Setup

### Step 1: Register Application in Azure

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for **App registrations** and select it
3. Click **New registration**
4. Enter details:
   - Name: "Agenda Sync"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
5. Click **Register**

### Step 2: Add Redirect URI

1. In the app's left menu, go to **Authentication**
2. Under Web, click **Add a URI**
3. Add: `http://localhost:5000/api/auth/microsoft/callback`
4. Click **Save**

### Step 3: Create Client Secret

1. In the left menu, go to **Certificates & secrets**
2. Click **New client secret**
3. Add description: "Agenda Sync Token"
4. Set expiration: 24 months
5. Click **Add**
6. Copy the **Value** (secret)

### Step 4: Grant Calendar Permissions

1. In the left menu, go to **API permissions**
2. Click **Add a permission**
3. Select **Microsoft Graph**
4. Click **Delegated permissions**
5. Search and select:
   - `Calendars.ReadWrite`
   - `openid`
   - `profile`
   - `email`
   - `offline_access`
6. Click **Add permissions**
7. Click **Grant admin consent** (if you're admin)

### Step 5: Add to Backend .env

```env
MICROSOFT_CLIENT_ID=your_app_id_here
MICROSOFT_CLIENT_SECRET=your_client_secret_here
MICROSOFT_REDIRECT_URI=http://localhost:5000/api/auth/microsoft/callback
```

---

## Frontend Configuration

Update `.env.local` in the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Testing OAuth Flow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm run dev`
3. Go to `http://localhost:3000/oauth-login`
4. Click **Login with Google** or **Login with Microsoft**
5. You'll be redirected to the provider's login page
6. After authorizing, you'll be redirected back to the dashboard
7. Your calendar events will start syncing!

---

## Production Deployment

When deploying to production:

1. Update redirect URIs in Google Cloud Console and Azure Portal:
   - Change from `http://localhost:5000` to your production domain
   - Example: `https://api.agenda-sync.com/api/auth/google/callback`

2. Update environment variables in production:
   - `.env` on backend server
   - `.env.local` or build-time variables on frontend

3. Ensure HTTPS is enabled (required by OAuth providers)

---

## Troubleshooting

### "Invalid Client ID"
- Verify Client ID/Secret are correct
- Check they match the redirect URI in OAuth settings

### "Redirect URI Mismatch"
- Ensure redirect URI matches exactly in:
  - Backend `.env` file
  - Google Cloud Console / Azure Portal

### "Permission Denied"
- Check you've granted Calendar.ReadWrite permissions
- Re-authenticate to authorize new scopes

### "Invalid Refresh Token"
- Offline access might not be enabled
- For Google: Ensure `access_type: offline` in authorization request
- For Microsoft: Include `offline_access` scope

---

## Revoking Access

Users can revoke access in their Google/Microsoft account settings:

- **Google**: [Security Settings](https://myaccount.google.com/security) → Apps with access
- **Microsoft**: [Connected Devices](https://account.microsoft.com/consent) → App permissions
