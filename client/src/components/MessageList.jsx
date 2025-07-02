import React from 'react';

const MessageList = ({ messages, loading }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.type}`}>
          <div className="message-content">
            <div className="message-text">
              {message.content.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line.includes('**') ? (
                    <span 
                      dangerouslySetInnerHTML={{
                        __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }}
                    />
                  ) : (
                    line
                  )}
                  {index < message.content.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>
            <div className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
          <div className="message-avatar">
            {message.type === 'bot' ? '🤖' : '👤'}
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="message bot">
          <div className="message-content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="message-avatar">🤖</div>
        </div>
      )}
    </div>
  );
};

export default MessageList;