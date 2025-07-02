import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';

const AuthComponent = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { instance } = useMsal();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const loginResponse = await instance.loginPopup(loginRequest);
      console.log('Login successful:', loginResponse);
      onLogin(loginResponse.account);
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
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