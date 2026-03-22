const axios = require('axios');

class MicrosoftOAuthService {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.authUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
    this.tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    this.scope = 'openid profile email Calendars.ReadWrite offline_access';
  }

  getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.scope,
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
      const response = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  async getCalendarId(accessToken) {
    try {
      const response = await axios.get(
        'https://graph.microsoft.com/v1.0/me/calendar',
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

module.exports = MicrosoftOAuthService;
