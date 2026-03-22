const axios = require('axios');

class GoogleOAuthService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    this.tokenUrl = 'https://oauth2.googleapis.com/token';
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'openid profile email https://www.googleapis.com/auth/calendar',
      access_type: 'offline',
      prompt: 'consent',
      state,
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(this.tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to exchange code for token: ${error.message}`);
    }
  }

  async getUserInfo(accessToken) {
    try {
      const response = await axios.get(
        'https://openidconnect.googleapis.com/v1/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  async getCalendarId(accessToken) {
    try {
      const response = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/primary',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.id;
    } catch (error) {
      throw new Error(`Failed to get calendar ID: ${error.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(this.tokenUrl, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to refresh token: ${error.message}`);
    }
  }
}

module.exports = GoogleOAuthService;
