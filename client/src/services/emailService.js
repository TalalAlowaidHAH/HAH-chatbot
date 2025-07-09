import axios from 'axios';

class EmailService {
  constructor() {
    this.baseURL = '/api/email';
    // Configure axios to include credentials for session-based auth
    axios.defaults.withCredentials = true;
  }

  async getEmailSummary(count = 10, filter = null) {
    try {
      const config = {
        params: { count, filter }
      };

      const response = await axios.get(`${this.baseURL}/summary`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching email summary:', error);
      throw new Error('Failed to fetch email summary');
    }
  }

  async getEmail(messageId) {
    try {
      const response = await axios.get(`${this.baseURL}/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching email:', error);
      throw new Error('Failed to fetch email');
    }
  }

  async sendEmail(to, subject, body, isHtml = true) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const data = { to, subject, body, isHtml };
      const response = await axios.post(`${this.baseURL}/send`, data, config);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async replyToEmail(messageId, body, isHtml = true) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const data = { body, isHtml };
      const response = await axios.post(`${this.baseURL}/${messageId}/reply`, data, config);
      return response.data;
    } catch (error) {
      console.error('Error replying to email:', error);
      throw new Error('Failed to reply to email');
    }
  }

  async searchEmails(query, count = 10) {
    try {
      const config = {
        params: { count }
      };

      const response = await axios.get(`${this.baseURL}/search/${encodeURIComponent(query)}`, config);
      return response.data;
    } catch (error) {
      console.error('Error searching emails:', error);
      throw new Error('Failed to search emails');
    }
  }
}

export const emailService = new EmailService();