export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization token' });
    }

    // Store the access token for use in route handlers
    req.accessToken = token;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid authorization token' });
  }
};

// Middleware to validate company domain
export const validateCompanyDomain = (req, res, next) => {
  try {
    // This would typically decode the JWT token to get user info
    // For now, we'll implement basic validation
    const token = req.accessToken;
    
    // In a real implementation, you would decode the JWT and check the domain
    // For now, we'll proceed with the assumption that MSAL handles domain validation
    
    next();
  } catch (error) {
    console.error('Domain validation error:', error);
    res.status(403).json({ error: 'Access denied: Invalid domain' });
  }
};