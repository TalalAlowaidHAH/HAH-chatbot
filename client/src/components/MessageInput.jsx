import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const quickActions = [
    { text: 'Summarize my emails', icon: '📧' },
    { text: 'Read latest email', icon: '📖' },
    { text: 'Search emails', icon: '🔍' },
    { text: 'Help', icon: '❓' }
  ];

  return (
    <div className="message-input-container">
      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action-btn"
            onClick={() => setInput(action.text)}
            disabled={disabled}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-text">{action.text}</span>
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Processing...' : 'Type your message here... (Shift+Enter for new line)'}
            disabled={disabled}
            className="message-textarea"
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="send-button"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;