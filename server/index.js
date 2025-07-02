import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
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
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://localhost:5173',
  credentials: true
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

// Create HTTPS server if SSL certificates exist, otherwise HTTP
const sslPath = path.join(__dirname, 'ssl');
const keyPath = path.join(sslPath, 'key.pem');
const certPath = path.join(sslPath, 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`🚀 HTTPS Server running on port ${PORT}`);
    console.log(`📧 Microsoft Graph integration enabled`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔐 SSL/TLS enabled`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`🚀 HTTP Server running on port ${PORT}`);
    console.log(`📧 Microsoft Graph integration enabled`);
    console.log(`🔒 Environment: ${process.env.NODE_ENV}`);
    console.log(`⚠️  HTTP mode - SSL certificates not found`);
  });
}