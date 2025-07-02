import axios from 'axios';

class EmailService {
  constructor() {
    this.baseURL = '/api/email';
  }

  async getEmailSummary(accessToken, count = 10, filter = null) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: { count, filter }
      };

      const response = await axios.get(`${this.baseURL}/summary`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching email summary:', error);
      throw new Error('Failed to fetch email summary');
    }
  }

  async getEmail(accessToken, messageId) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      };

      const response = await axios.get(`${this.baseURL}/${messageId}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching email:', error);
      throw new Error('Failed to fetch email');
    }
  }

  async sendEmail(accessToken, to, subject, body, isHtml = true) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  async replyToEmail(accessToken, messageId, body, isHtml = true) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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

  async searchEmails(accessToken, query, count = 10) {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
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