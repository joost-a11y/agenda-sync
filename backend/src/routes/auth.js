const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { getGoogleAuthUrl, googleCallback, getMicrosoftAuthUrl, microsoftCallback } = require('../controllers/oauthController');

const router = express.Router();

// Local auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getProfile);

// Google OAuth
router.get('/google/url', getGoogleAuthUrl);
router.get('/google/callback', googleCallback);

// Microsoft OAuth
router.get('/microsoft/url', getMicrosoftAuthUrl);
router.get('/microsoft/callback', microsoftCallback);

module.exports = router;
