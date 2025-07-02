import { useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import AuthComponent from './components/AuthComponent';
import ChatInterface from './components/ChatInterface';
import { msalConfig } from './config/msalConfig';
import './styles/App.css';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          setIsAuthenticated(true);
          setUser(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const handleLogin = (account) => {
    setIsAuthenticated(true);
    setUser(account);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    msalInstance.logoutPopup();
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h1>HAH Email Assistant</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src="/hassan-allam-logo.png"
                alt="Hassan Allam Holding"
                className="company-logo"
              />
              {isAuthenticated && user && (
                <div className="user-info">
                  <span>Welcome, {user.name || user.username}</span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          {!isAuthenticated ? (
            <AuthComponent onLogin={handleLogin} />
          ) : (
            <ChatInterface user={user} />
          )}
        </main>
      </div>
    </MsalProvider>
  );
}

export default App;