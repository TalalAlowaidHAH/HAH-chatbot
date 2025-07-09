import { useState, useEffect } from 'react';
import AuthComponent from './components/AuthComponent';
import ChatInterface from './components/ChatInterface';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated) {
          const userResponse = await fetch('/api/auth/user', {
            credentials: 'include'
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setIsAuthenticated(true);
            setUser(userData.user);
          }
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (account) => {
    setIsAuthenticated(true);
    setUser(account);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
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
  );
}

export default App;