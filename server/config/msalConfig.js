import { ConfidentialClientApplication } from '@azure/msal-node';
import dotenv from 'dotenv';

dotenv.config();

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authority: process.env.AUTHORITY || `https://login.microsoftonline.com/${process.env.TENANT_ID}`
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        if (process.env.NODE_ENV === 'development') {
          console.log(message);
        }
      },
      piiLoggingEnabled: false,
      logLevel: process.env.NODE_ENV === 'development' ? 'Info' : 'Error',
    }
  }
};

// Create MSAL instance
export const confidentialClientApp = new ConfidentialClientApplication(msalConfig);

// Required scopes for Microsoft Graph (matching Azure App Registration)
export const requiredScopes = [
  'https://graph.microsoft.com/Mail.Read',
  'https://graph.microsoft.com/User.Read'
];

export default msalConfig;