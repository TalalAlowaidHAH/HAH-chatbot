import express from 'express';
import { confidentialClientApp, requiredScopes } from '../config/msalConfig.js';

const router = express.Router();

// Company domain validation is now handled in the main OAuth callback

// Generate auth URL for login
router.get('/login', async (req, res) => {
  try {
    const authCodeUrlParameters = {
      scopes: requiredScopes,
      redirectUri: 'http://localhost:3000',
      state: req.session.id || 'default-state',
    };

    const authUrl = await confidentialClientApp.getAuthCodeUrl(authCodeUrlParameters);
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).send('Authentication error. Please try again.');
  }
});

// OAuth callback is now handled at root path

// Get current user info (requires session)
router.get('/user', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    authenticated: true,
    user: {
      username: req.session.user.account.username,
      name: req.session.user.account.name,
      homeAccountId: req.session.user.account.homeAccountId
    }
  });
});

// Refresh token (internal use only)
router.post('/refresh', async (req, res) => {
  try {
    if (!req.session.user || !req.session.user.refreshToken) {
      return res.status(401).json({ error: 'No refresh token available' });
    }

    const refreshTokenRequest = {
      refreshToken: req.session.user.refreshToken,
      scopes: requiredScopes,
      account: req.session.user.account
    };

    const response = await confidentialClientApp.acquireTokenSilent(refreshTokenRequest);
    
    // Update session with new tokens
    req.session.user.accessToken = response.accessToken;
    req.session.user.expiresOn = response.expiresOn;
    if (response.refreshToken) {
      req.session.user.refreshToken = response.refreshToken;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear invalid session
    req.session.destroy();
    res.status(401).json({ error: 'Session expired, please login again' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

// Check authentication status
router.get('/status', (req, res) => {
  const isAuthenticated = !!(req.session.user && req.session.user.accessToken);
  res.json({ authenticated: isAuthenticated });
});

export default router;