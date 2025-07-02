import express from 'express';
import { confidentialClientApp, requiredScopes } from '../config/msalConfig.js';

const router = express.Router();

// Generate auth URL for client-side redirect
router.get('/url', async (req, res) => {
  try {
    const authCodeUrlParameters = {
      scopes: requiredScopes,
      redirectUri: req.query.redirectUri || 'http://localhost:5173/auth/callback',
    };

    const authUrl = await confidentialClientApp.getAuthCodeUrl(authCodeUrlParameters);
    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

// Handle callback and exchange code for token
router.post('/callback', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokenRequest = {
      code: code,
      scopes: requiredScopes,
      redirectUri: redirectUri || 'http://localhost:5173/auth/callback',
    };

    const response = await confidentialClientApp.acquireTokenByCode(tokenRequest);
    
    // Return access token and user info (excluding sensitive data)
    res.json({
      accessToken: response.accessToken,
      expiresOn: response.expiresOn,
      account: {
        homeAccountId: response.account.homeAccountId,
        username: response.account.username,
        name: response.account.name
      }
    });
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange authorization code for token' });
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken, account } = req.body;

    if (!refreshToken || !account) {
      return res.status(400).json({ error: 'Refresh token and account are required' });
    }

    const refreshTokenRequest = {
      refreshToken: refreshToken,
      scopes: requiredScopes,
      account: account
    };

    const response = await confidentialClientApp.acquireTokenSilent(refreshTokenRequest);
    
    res.json({
      accessToken: response.accessToken,
      expiresOn: response.expiresOn
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

// Validate token endpoint
router.post('/validate', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    // Simple validation - in production you might want to verify the token with Microsoft
    // For now, we'll trust the client-side validation and just return success
    res.json({ valid: true });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;