export class EmailService {
  constructor(graphClient) {
    this.graphClient = graphClient;
  }

  async getEmailSummary(count = 10, filter = null) {
    try {
      let query = `/me/messages?$top=${count}&$select=id,subject,from,receivedDateTime,isRead,importance,bodyPreview&$orderby=receivedDateTime desc`;
      
      if (filter) {
        query += `&$filter=${encodeURIComponent(filter)}`;
      }

      const messages = await this.graphClient.api(query).get();
      
      return {
        totalCount: messages.value.length,
        messages: messages.value.map(msg => ({
          id: msg.id,
          subject: msg.subject,
          from: msg.from?.emailAddress?.name || msg.from?.emailAddress?.address || 'Unknown',
          fromEmail: msg.from?.emailAddress?.address,
          receivedDateTime: msg.receivedDateTime,
          isRead: msg.isRead,
          importance: msg.importance,
          preview: msg.bodyPreview?.substring(0, 150) + (msg.bodyPreview?.length > 150 ? '...' : '')
        }))
      };
    } catch (error) {
      console.error('Error fetching email summary:', error);
      throw new Error('Failed to fetch email summary');
    }
  }

  async getEmail(messageId) {
    try {
      const message = await this.graphClient
        .api(`/me/messages/${messageId}`)
        .select('id,subject,from,toRecipients,receivedDateTime,sentDateTime,body,isRead,importance,conversationId')
        .get();

      return {
        id: message.id,
        subject: message.subject,
        from: {
          name: message.from?.emailAddress?.name,
          email: message.from?.emailAddress?.address
        },
        to: message.toRecipients?.map(recipient => ({
          name: recipient.emailAddress?.name,
          email: recipient.emailAddress?.address
        })) || [],
        receivedDateTime: message.receivedDateTime,
        sentDateTime: message.sentDateTime,
        body: {
          content: message.body?.content,
          contentType: message.body?.contentType
        },
        isRead: message.isRead,
        importance: message.importance,
        conversationId: message.conversationId
      };
    } catch (error) {
      console.error('Error fetching email:', error);
      throw new Error('Failed to fetch email');
    }
  }

  async sendEmail(to, subject, body, isHtml = true) {
    try {
      const toRecipients = Array.isArray(to) ? to : [to];
      
      const message = {
        subject: subject,
        body: {
          contentType: isHtml ? 'HTML' : 'Text',
          content: body
        },
        toRecipients: toRecipients.map(email => ({
          emailAddress: {
            address: typeof email === 'string' ? email : email.address,
            name: typeof email === 'string' ? email : email.name
          }
        }))
      };

      const result = await this.graphClient
        .api('/me/sendMail')
        .post({ message });

      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async replyToEmail(messageId, body, isHtml = true) {
    try {
      const replyMessage = {
        comment: body
      };

      const result = await this.graphClient
        .api(`/me/messages/${messageId}/reply`)
        .post(replyMessage);

      return result;
    } catch (error) {
      console.error('Error replying to email:', error);
      throw new Error('Failed to reply to email');
    }
  }

  async searchEmails(query, count = 10) {
    try {
      const searchQuery = `/me/messages?$search="${encodeURIComponent(query)}"&$top=${count}&$select=id,subject,from,receivedDateTime,isRead,importance,bodyPreview&$orderby=receivedDateTime desc`;
      
      const messages = await this.graphClient.api(searchQuery).get();
      
      return {
        query: query,
        totalCount: messages.value.length,
        messages: messages.value.map(msg => ({
          id: msg.id,
          subject: msg.subject,
          from: msg.from?.emailAddress?.name || msg.from?.emailAddress?.address || 'Unknown',
          fromEmail: msg.from?.emailAddress?.address,
          receivedDateTime: msg.receivedDateTime,
          isRead: msg.isRead,
          importance: msg.importance,
          preview: msg.bodyPreview?.substring(0, 150) + (msg.bodyPreview?.length > 150 ? '...' : '')
        }))
      };
    } catch (error) {
      console.error('Error searching emails:', error);
      throw new Error('Failed to search emails');
    }
  }

  async markAsRead(messageId) {
    try {
      await this.graphClient
        .api(`/me/messages/${messageId}`)
        .patch({ isRead: true });
      
      return { success: true };
    } catch (error) {
      console.error('Error marking email as read:', error);
      throw new Error('Failed to mark email as read');
    }
  }

  async deleteEmail(messageId) {
    try {
      await this.graphClient
        .api(`/me/messages/${messageId}`)
        .delete();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting email:', error);
      throw new Error('Failed to delete email');
    }
  }
}