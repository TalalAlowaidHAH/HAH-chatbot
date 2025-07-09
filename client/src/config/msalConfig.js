export const msalConfig = {
  auth: {
    clientId: '73f3c135-b612-4ba4-b1c3-02e30067c960',
    authority: 'https://login.microsoftonline.com/8410b133-9b6e-462f-bdea-15568f0248a3',
    // redirectUri: window.location.origin,
    redirectUri: 'http://localhost:3000',
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case 'Error':
            console.error(message);
            return;
          case 'Info':
            console.info(message);
            return;
          case 'Verbose':
            console.debug(message);
            return;
          case 'Warning':
            console.warn(message);
            return;
        }
      }
    }
  }
};

export const loginRequest = {
  scopes: [
    'https://graph.microsoft.com/Mail.Read',
    // 'https://graph.microsoft.com/Mail.Send',
    // 'https://graph.microsoft.com/Mail.ReadWrite',
    'https://graph.microsoft.com/User.Read'
  ],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphMailEndpoint: 'https://graph.microsoft.com/v1.0/me/messages'
};