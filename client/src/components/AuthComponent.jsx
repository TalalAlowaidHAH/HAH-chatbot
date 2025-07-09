import React, { useState, useEffect } from 'react';

const AuthComponent = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for auth results in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const authResult = urlParams.get('auth');
    const authError = urlParams.get('error');

    if (authResult === 'success') {
      // Authentication successful, check user status
      checkAuthStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (authError) {
      handleAuthError(authError);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAuthError = (errorCode) => {
    switch (errorCode) {
      case 'domain_restricted':
        setError('Access denied: Please use your Hassan Allam company email account.');
        break;
      case 'oauth_error':
        setError('Authentication failed. Please try again.');
        break;
      case 'auth_failed':
        setError('Login failed. Please try again.');
        break;
      default:
        setError('An error occurred during authentication. Please try again.');
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/user', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData.user);
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    }
  };

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    
    // Redirect to backend auth endpoint
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome to HAH Email Assistant</h2>
          <p>Sign in with your company Microsoft account to get started</p>
        </div>
        
        <div className="auth-content">
          <div className="features-list">
            <h3>What you can do:</h3>
            <ul>
              <li>📧 Get quick email summaries</li>
              <li>🔍 Search and read specific emails</li>
              <li>✍️ Compose and send emails naturally</li>
              <li>↩️ Reply to messages quickly</li>
              <li>🔒 Secure Hassan Allam company access</li>
            </ul>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin} 
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>

          <div className="security-notice">
            <p><strong>Security Notice:</strong> This app only accesses your company email account and does not store any personal information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;