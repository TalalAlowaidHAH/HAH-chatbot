export const authMiddleware = (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (!req.session.user || !req.session.user.accessToken) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if token is expired
    if (req.session.user.expiresOn && new Date(req.session.user.expiresOn) < new Date()) {
      return res.status(401).json({ error: 'Token expired, please login again' });
    }

    // Store the access token and user info for use in route handlers
    req.accessToken = req.session.user.accessToken;
    req.user = req.session.user.account;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware to validate company domain - now integrated into auth flow
export const validateCompanyDomain = (req, res, next) => {
  try {
    // Domain validation is now handled during the authentication process
    // This middleware is mainly for additional validation if needed
    const user = req.user;
    
    if (!user || !user.username || !user.username.endsWith('@hassanallam.com')) {
      return res.status(403).json({ error: 'Access denied: Hassan Allam domain required' });
    }
    
    next();
  } catch (error) {
    console.error('Domain validation error:', error);
    res.status(403).json({ error: 'Access denied: Invalid domain' });
  }
};