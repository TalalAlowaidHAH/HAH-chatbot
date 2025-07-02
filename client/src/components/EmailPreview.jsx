import React from 'react';

const EmailPreview = ({ email, onClose }) => {
  if (!email) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="email-preview-overlay">
      <div className="email-preview">
        <div className="email-header">
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
          <h2>Email Preview</h2>
        </div>
        
        <div className="email-content">
          <div className="email-meta">
            <div className="meta-row">
              <strong>Subject:</strong> {email.subject}
            </div>
            <div className="meta-row">
              <strong>From:</strong> {email.from.name} ({email.from.email})
            </div>
            <div className="meta-row">
              <strong>To:</strong> {email.to.map(recipient => 
                `${recipient.name} (${recipient.email})`
              ).join(', ')}
            </div>
            <div className="meta-row">
              <strong>Received:</strong> {formatDate(email.receivedDateTime)}
            </div>
            {email.importance !== 'normal' && (
              <div className="meta-row">
                <strong>Importance:</strong> 
                <span className={`importance ${email.importance}`}>
                  {email.importance}
                </span>
              </div>
            )}
          </div>
          
          <div className="email-body">
            {email.body.contentType === 'HTML' ? (
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: email.body.content 
                }}
                className="html-content"
              />
            ) : (
              <div className="text-content">
                {email.body.content}
              </div>
            )}
          </div>
        </div>
        
        <div className="email-actions">
          <button className="action-btn reply-btn">
            Reply
          </button>
          <button className="action-btn forward-btn">
            Forward
          </button>
          <button className="action-btn delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;