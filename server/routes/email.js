import express from 'express';
import { Client } from '@microsoft/microsoft-graph-client';
import { authMiddleware } from '../middleware/auth.js';
import { EmailService } from '../services/EmailService.js';

const router = express.Router();

// Apply authentication middleware to all email routes
router.use(authMiddleware);

// Get email summary
router.get('/summary', async (req, res) => {
  try {
    const { count = 10, filter } = req.query;
    const accessToken = req.accessToken;

    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const emailService = new EmailService(graphClient);
    const summary = await emailService.getEmailSummary(parseInt(count), filter);

    res.json(summary);
  } catch (error) {
    console.error('Email summary error:', error);
    res.status(500).json({ error: 'Failed to fetch email summary' });
  }
});

// Get specific email
router.get('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const accessToken = req.accessToken;

    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const emailService = new EmailService(graphClient);
    const email = await emailService.getEmail(messageId);

    res.json(email);
  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({ error: 'Failed to fetch email' });
  }
});

// Send new email
router.post('/send', async (req, res) => {
  try {
    const { to, subject, body, isHtml = true } = req.body;
    const accessToken = req.accessToken;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: 'To, subject, and body are required' });
    }

    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const emailService = new EmailService(graphClient);
    const result = await emailService.sendEmail(to, subject, body, isHtml);

    res.json({ success: true, messageId: result });
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Reply to email
router.post('/:messageId/reply', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { body, isHtml = true } = req.body;
    const accessToken = req.accessToken;

    if (!body) {
      return res.status(400).json({ error: 'Body is required' });
    }

    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const emailService = new EmailService(graphClient);
    const result = await emailService.replyToEmail(messageId, body, isHtml);

    res.json({ success: true, result });
  } catch (error) {
    console.error('Reply email error:', error);
    res.status(500).json({ error: 'Failed to reply to email' });
  }
});

// Search emails
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { count = 10 } = req.query;
    const accessToken = req.accessToken;

    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const emailService = new EmailService(graphClient);
    const results = await emailService.searchEmails(query, parseInt(count));

    res.json(results);
  } catch (error) {
    console.error('Search emails error:', error);
    res.status(500).json({ error: 'Failed to search emails' });
  }
});

export default router;