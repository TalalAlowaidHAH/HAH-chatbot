import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import emailRoutes from './routes/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:5174',
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Move OAuth callback logic to main app (BEFORE other routes)
app.use('/', async (req, res, next) => {
  // Only handle root path for OAuth callback
  if (req.path === '/' && req.method === 'GET') {
    const { code, state, error } = req.query;
    
    // If this is an OAuth callback (has code or error parameter)
    if (code || error) {
      // Import necessary modules for token exchange
      const { confidentialClientApp, requiredScopes } = await import('./config/msalConfig.js');
      
      try {
        if (error) {
          console.error('OAuth error:', error);
          return res.redirect(`${process.env.CLIENT_URL || 'https://localhost:5174'}?error=oauth_error`);
        }

        if (!code) {
          return res.redirect(`${process.env.CLIENT_URL || 'https://localhost:5174'}?error=missing_code`);
        }

        // Exchange authorization code for tokens
        const tokenRequest = {
          code: code,
          scopes: requiredScopes,
          redirectUri: 'http://localhost:3000',
        };

        const response = await confidentialClientApp.acquireTokenByCode(tokenRequest);
        
        // Validate company domain (case-insensitive)
        const companyDomain = 'hassanallam.com';
        const userEmail = response.account.username?.toLowerCase() || '';
        if (!userEmail || !userEmail.endsWith(`@${companyDomain}`)) {
          throw new Error(`Access restricted to ${companyDomain} accounts only`);
        }
        
        // Store tokens securely in session
        req.session.user = {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresOn: response.expiresOn,
          account: {
            homeAccountId: response.account.homeAccountId,
            username: response.account.username,
            name: response.account.name
          }
        };

        // Save session before redirect
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
          }
          // Redirect to frontend after successful authentication
          res.redirect(`${process.env.CLIENT_URL || 'https://localhost:5174'}?auth=success`);
        });
        
      } catch (error) {
        console.error('Token exchange error:', error);
        const errorMessage = error.message.includes('hassanallam.com') 
          ? 'domain_restricted' 
          : 'auth_failed';
        res.redirect(`${process.env.CLIENT_URL || 'https://localhost:5174'}?error=${errorMessage}`);
      }
    } else {
      // Regular request - redirect to frontend
      res.redirect(process.env.CLIENT_URL || 'https://localhost:5174');
    }
  } else {
    // Not root path, continue to next middleware
    next();
  }
});

// Handle root path redirect to frontend (fallback)
app.get('/', (req, res) => {
  res.redirect(process.env.CLIENT_URL || 'https://localhost:5174');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start HTTP server for OAuth callback (Azure redirect URI)
app.listen(3000, () => {
  console.log(`🔓 HTTP Server running on port 3000 (OAuth callback + API)`);
  console.log(`📧 Microsoft Graph integration enabled`);
  console.log(`🔒 Environment: ${process.env.NODE_ENV}`);
});