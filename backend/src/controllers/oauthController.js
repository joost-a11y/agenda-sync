const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const GoogleOAuthService = require('../services/googleOAuthService');
const MicrosoftOAuthService = require('../services/microsoftOAuthService');

const googleOAuth = new GoogleOAuthService(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const microsoftOAuth = new MicrosoftOAuthService(
  process.env.MICROSOFT_CLIENT_ID,
  process.env.MICROSOFT_CLIENT_SECRET,
  process.env.MICROSOFT_REDIRECT_URI
);

// Google OAuth Flow
const getGoogleAuthUrl = (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session = req.session || {};
  req.session.oauthState = state;

  const authUrl = googleOAuth.getAuthorizationUrl(state);
  res.json({ authUrl });
};

const googleCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Exchange code for tokens
    const tokens = await googleOAuth.exchangeCodeForToken(code);
    const userInfo = await googleOAuth.getUserInfo(tokens.access_token);
    const calendarId = await googleOAuth.getCalendarId(tokens.access_token);

    // Find or create user
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [userInfo.email]);

    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO users (email, google_calendar_id, primary_calendar_type, google_access_token, google_refresh_token)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, primary_calendar_type, google_calendar_id`,
        [userInfo.email, calendarId, 'google', tokens.access_token, tokens.refresh_token || null]
      );
    } else {
      // Update existing user with Google tokens
      user = await pool.query(
        `UPDATE users 
         SET google_calendar_id = $1, primary_calendar_type = $2, google_access_token = $3, google_refresh_token = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, email, primary_calendar_type, google_calendar_id`,
        [calendarId, 'google', tokens.access_token, tokens.refresh_token || null, user.rows[0].id]
      );
    }

    const userData = user.rows[0];
    const jwtToken = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?token=${jwtToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/?error=oauth_failed`);
  }
};

// Microsoft OAuth Flow
const getMicrosoftAuthUrl = (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session = req.session || {};
  req.session.oauthState = state;

  const authUrl = microsoftOAuth.getAuthorizationUrl(state);
  res.json({ authUrl });
};

const microsoftCallback = async (req, res) => {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code not provided' });
  }

  try {
    // Exchange code for tokens
    const tokens = await microsoftOAuth.exchangeCodeForToken(code);
    const userInfo = await microsoftOAuth.getUserInfo(tokens.access_token);
    const calendarId = await microsoftOAuth.getCalendarId(tokens.access_token);

    // Find or create user
    let user = await pool.query('SELECT * FROM users WHERE email = $1', [userInfo.mail || userInfo.userPrincipalName]);

    const email = userInfo.mail || userInfo.userPrincipalName;

    if (user.rows.length === 0) {
      user = await pool.query(
        `INSERT INTO users (email, outlook_calendar_id, primary_calendar_type, microsoft_access_token, microsoft_refresh_token)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, primary_calendar_type, outlook_calendar_id`,
        [email, calendarId, 'outlook', tokens.access_token, tokens.refresh_token || null]
      );
    } else {
      // Update existing user with Microsoft tokens
      user = await pool.query(
        `UPDATE users 
         SET outlook_calendar_id = $1, primary_calendar_type = $2, microsoft_access_token = $3, microsoft_refresh_token = $4, updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING id, email, primary_calendar_type, outlook_calendar_id`,
        [calendarId, 'outlook', tokens.access_token, tokens.refresh_token || null, user.rows[0].id]
      );
    }

    const userData = user.rows[0];
    const jwtToken = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard?token=${jwtToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/?error=oauth_failed`);
  }
};

module.exports = {
  getGoogleAuthUrl,
  googleCallback,
  getMicrosoftAuthUrl,
  microsoftCallback,
};
