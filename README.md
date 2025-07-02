# 📧 HAH Email Assistant

> A conversational email management system for Hassan Allam Holding employees

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)

HAH Email Assistant transforms how employees interact with their Microsoft 365 email through an intuitive chat interface. Built with security and productivity in mind, it enables users to read, summarize, and send emails using natural language commands.

## ✨ Key Features

- 🤖 **Conversational Email Management** - Interact with emails through natural language
- 📊 **Smart Email Summarization** - Get instant summaries of your inbox or specific emails
- 📨 **Compose & Reply** - Send emails and replies through chat commands
- 🔐 **Enterprise Security** - OAuth2 authentication with Microsoft 365 integration
- 🏢 **Company-Restricted Access** - Limited to Hassan Allam Holding domain accounts
- 📱 **Cross-Platform** - Responsive design for desktop and mobile devices
- ⚡ **Real-time Processing** - No persistent storage, all processing happens in-memory

## Prerequisites

- Node.js 18+
- Microsoft 365 account with appropriate permissions
- Azure App Registration with Graph API permissions

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TalalAlowaidHAH/HAH-chatbot.git
   cd HAH-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   ```
   Update `.env` with your Azure App Registration details:
   ```env
   CLIENT_ID=your-azure-client-id
   TENANT_ID=your-azure-tenant-id
   CLIENT_SECRET=your-azure-client-secret
   CLIENT_URL=https://localhost:5173
   ```

### Development

Start both frontend and backend servers:
```bash
npm run dev
```

This launches:
- 🖥️ **Backend**: `https://localhost:3001` (Express + Microsoft Graph API)
- 🌐 **Frontend**: `https://localhost:5173` (React + Vite)

### Individual Services

```bash
# Start only the backend server
npm run server:dev

# Start only the frontend (in client directory)
npm run client:dev
```

### Network Access

Access from other devices on your network:
1. Start development: `npm run dev`
2. Visit: `https://[YOUR_NETWORK_IP]:5173`
3. Accept self-signed certificate warnings

> ⚠️ **HTTPS Required**: Microsoft Graph API requires HTTPS for authentication across networks

### Production Deployment

```bash
npm run build    # Build client for production
npm start        # Start production server
```

## 🏗️ Technical Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express Server │────│ Microsoft Graph │
│                 │    │                 │    │      API        │
│ • MSAL Auth     │    │ • OAuth2 Proxy  │    │ • Email Ops     │
│ • Chat UI       │    │ • Rate Limiting │    │ • User Profile  │
│ • Vite Dev      │    │ • Security      │    │ • Permissions   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: React 18, Vite, MSAL (Microsoft Authentication Library)
- **Backend**: Node.js, Express, Microsoft Graph SDK
- **Authentication**: OAuth2 with Microsoft Identity Platform
- **Security**: Helmet, CORS, Rate Limiting, Company Domain Restrictions
- **Development**: Concurrently, Nodemon, HTTPS with self-signed certificates

## 🔒 Security Features

- ✅ **Zero Persistence** - All email data processed in-memory only
- ✅ **Domain Restrictions** - Hassan Allam Holding accounts only
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **HTTPS Enforcement** - SSL/TLS for all communications
- ✅ **Security Headers** - Helmet.js protection
- ✅ **OAuth2 Flow** - Secure Microsoft 365 integration

## 📝 Usage Examples

```bash
# User: "Summarize my last 10 emails"
# Assistant: Returns bullet-point summaries with sender, subject, and key points

# User: "Read the email from John about the project update"
# Assistant: Displays full email content with metadata

# User: "Reply to Sarah's email saying I'll review the document tomorrow"
# Assistant: Composes and sends reply with confirmation
```

## 🤝 Contributing

This is an internal project for **Hassan Allam Holding**. 

- Follow company development guidelines
- Ensure all changes maintain security standards
- Test with company Microsoft 365 accounts only

## 📄 License

MIT License - **Internal Use Only**  
© Hassan Allam Holding