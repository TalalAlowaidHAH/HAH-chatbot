import React, { useState, useRef, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../config/msalConfig';
import { emailService } from '../services/emailService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import EmailPreview from './EmailPreview';

const ChatInterface = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user.name || user.username}! I'm your email assistant. I can help you summarize emails, read specific messages, compose new emails, and reply to existing ones. What would you like to do?`,
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const messagesEndRef = useRef(null);
  const { instance } = useMsal();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAccessToken = async () => {
    try {
      const accounts = instance.getAllAccounts();
      if (accounts.length === 0) throw new Error('No accounts found');
      
      const request = {
        ...loginRequest,
        account: accounts[0]
      };
      
      const response = await instance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition failed:', error);
      throw error;
    }
  };

  const addMessage = (content, type = 'user') => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const processCommand = async (input) => {
    const lowerInput = input.toLowerCase().trim();
    
    try {
      const accessToken = await getAccessToken();
      
      // Summarize emails
      if (lowerInput.includes('summarize') || lowerInput.includes('summary')) {
        const count = extractNumber(input) || 10;
        const summary = await emailService.getEmailSummary(accessToken, count);
        
        let response = `Here's a summary of your latest ${summary.totalCount} emails:\n\n`;
        summary.messages.forEach((email, index) => {
          const status = email.isRead ? '📖' : '📩';
          const importance = email.importance === 'high' ? '🔴 ' : '';
          response += `${status} ${importance}**${email.subject}**\n`;
          response += `From: ${email.from}\n`;
          response += `${email.preview}\n\n`;
        });
        
        return response;
      }
      
      // Read specific email
      if (lowerInput.includes('read') && (lowerInput.includes('email') || lowerInput.includes('message'))) {
        const summary = await emailService.getEmailSummary(accessToken, 5);
        if (summary.messages.length > 0) {
          const email = await emailService.getEmail(accessToken, summary.messages[0].id);
          setSelectedEmail(email);
          return `Here's the latest email from ${email.from.name}:\n\n**${email.subject}**\n\n${email.body.content}`;
        }
        return 'No emails found to read.';
      }
      
      // Search emails
      if (lowerInput.includes('search') || lowerInput.includes('find')) {
        const searchQuery = extractSearchQuery(input);
        if (searchQuery) {
          const results = await emailService.searchEmails(accessToken, searchQuery);
          let response = `Found ${results.totalCount} emails matching "${searchQuery}":\n\n`;
          results.messages.forEach(email => {
            response += `📧 **${email.subject}**\nFrom: ${email.from}\n${email.preview}\n\n`;
          });
          return response;
        }
        return 'Please specify what to search for (e.g., "search for emails from John").';
      }
      
      // Send email
      if (lowerInput.includes('send') || lowerInput.includes('compose')) {
        return 'I can help you compose an email. Please provide:\n- Recipient email address\n- Subject\n- Message content\n\nExample: "Send email to john@company.com with subject Meeting Tomorrow and message: Hi John, let\'s meet at 2 PM."';
      }
      
      // General help
      if (lowerInput.includes('help')) {
        return `Here's what I can help you with:

📧 **Email Summary**: "Summarize my last 10 emails"
🔍 **Search**: "Search for emails from John" or "Find emails about project"
📖 **Read**: "Read my latest email"
✍️ **Compose**: "Send email to someone@company.com..."
↩️ **Reply**: "Reply to the last email with..."

Just type naturally and I'll understand what you want to do!`;
      }
      
      return `I'm not sure how to help with that. Try commands like:
- "Summarize my emails"
- "Search for emails from [name]"
- "Read my latest email"
- "Send email to [email] with subject [subject]"
- "Help" for more options`;
      
    } catch (error) {
      console.error('Command processing error:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  };

  const extractNumber = (text) => {
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : null;
  };

  const extractSearchQuery = (text) => {
    const patterns = [
      /search for (.+)/i,
      /find (.+)/i,
      /search (.+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };

  const handleSendMessage = async (input) => {
    if (!input.trim()) return;

    addMessage(input, 'user');
    setLoading(true);

    try {
      const response = await processCommand(input);
      setTimeout(() => {
        addMessage(response, 'bot');
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage('Sorry, I encountered an error. Please try again.', 'bot');
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-container">
        <div className="messages-container">
          <MessageList messages={messages} loading={loading} />
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
      
      {selectedEmail && (
        <EmailPreview 
          email={selectedEmail} 
          onClose={() => setSelectedEmail(null)} 
        />
      )}
    </div>
  );
};

export default ChatInterface;