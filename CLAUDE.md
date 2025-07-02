# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HAH Chatbot is a web-based email management application for Hassan Allam Holding employees. It integrates with Microsoft Graph API to provide conversational email operations including reading, summarizing, and sending emails through a chat interface.

## Architecture

**Frontend (React + Vite)**
- Located in `/client/` directory
- Uses Microsoft Authentication Library (MSAL) for OAuth2 authentication
- Components: AuthComponent, ChatInterface, EmailPreview, MessageInput, MessageList
- Styled with custom CSS using Hassan Allam branding

**Backend (Node.js + Express)**
- Located in `/server/` directory  
- HTTPS-enabled with self-signed certificates for development
- Routes: `/api/auth` for authentication, `/api/email` for email operations
- Services: EmailService.js handles Microsoft Graph API integration
- Security: Helmet, CORS, rate limiting, company domain restrictions

**Key Dependencies**
- `@azure/msal-browser` and `@azure/msal-node` for Microsoft authentication
- `@microsoft/microsoft-graph-client` for Graph API integration
- `express-rate-limit` for API protection
- `concurrently` for running client and server simultaneously

## Development Commands

**Setup**
```bash
npm run install-all    # Install dependencies for both client and server
```

**Development**
```bash
npm run dev            # Start both client (https://localhost:5173) and server (https://localhost:3001)
npm run server:dev     # Start only the backend server with nodemon
npm run client:dev     # Start only the frontend development server
```

**Production**
```bash
npm run build          # Build the client for production
npm start              # Start the production server
```

## HTTPS Configuration

The application requires HTTPS for Microsoft Graph API authentication. Development uses self-signed certificates located in `server/ssl/` (cert.pem, key.pem). The server automatically falls back to HTTP if certificates are missing.

## Authentication Flow

1. User authenticates via Microsoft OAuth2 using company credentials
2. MSAL handles token management and refresh
3. Backend validates tokens and enforces company domain restrictions
4. Microsoft Graph API calls are made with user tokens for email operations

## Microsoft Graph Integration

The application uses Microsoft Graph API for:
- Reading user emails with filtering options
- Sending new emails and replies
- Email summarization and content processing
- User profile information retrieval

API permissions are configured in Azure App Registration with appropriate scopes for email access.

## Security Features

- Company domain restrictions (Hassan Allam accounts only)
- No persistent storage of email content (in-memory processing only)
- Rate limiting (100 requests per 15 minutes per IP)
- HTTPS enforcement for network access
- Security headers via Helmet middleware

## Environment Variables

The application requires Azure App Registration credentials:
- Application (client) ID: 73f3c135-b612-4ba4-b1c3-02e30067c960
- Directory (tenant) ID: 8410b133-9b6e-462f-bdea-15568f0248a3
- Client secret and other sensitive configuration should be in `.env` files

## Component Structure

**Client Components:**
- `AuthComponent.jsx` - Handles Microsoft OAuth login flow
- `ChatInterface.jsx` - Main chat UI for email operations  
- `EmailPreview.jsx` - Displays email content and metadata
- `MessageInput.jsx` - User input for chat commands
- `MessageList.jsx` - Chat message history display

**Server Routes:**
- `routes/auth.js` - Authentication endpoints
- `routes/email.js` - Email operation endpoints
- `services/EmailService.js` - Microsoft Graph API client wrapper