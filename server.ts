import express from 'express';
import type { Request, Response, Router, RequestHandler } from 'express';
import cors from 'cors';
import twilio from 'twilio';

const app = express();
const router: Router = express.Router();
const port = process.env.PORT || 3001;

// Twilio configuration
const accountSid = 'ACf4c5ce477bb6d5ce11ff20a550f1bef5';
const authToken = 'cfbabf95a7e97d12a3733381d8f8c442';
const client = twilio(accountSid, authToken);

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Crisis alert endpoint
const crisisAlertHandler: RequestHandler = async (req, res) => {
  try {
    const { username, latitude, longitude } = req.body;
    console.log('Received crisis alert request:', { username, latitude, longitude });

    if (!username || !latitude || !longitude) {
      console.error('Missing required fields:', { username, latitude, longitude });
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const emergencyMessage = `${username} needs help. Their location is https://maps.google.com/?q=${latitude},${longitude}`;
    console.log('Sending WhatsApp message:', emergencyMessage);

    const message = await client.messages.create({
      body: emergencyMessage,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919178379226'
    });

    console.log('WhatsApp message sent successfully:', message.sid);
    res.status(200).json({ 
      message: 'Crisis alert sent successfully',
      messageId: message.sid 
    });
  } catch (error) {
    console.error('Failed to send crisis alert:', error);
    res.status(500).json({ 
      message: 'Failed to send crisis alert',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.post('/crisis-alert', crisisAlertHandler);

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Mount router
app.use('/api', router);

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Twilio configuration:', {
    accountSid: accountSid.substring(0, 5) + '...',
    fromNumber: 'whatsapp:+14155238886',
    toNumber: 'whatsapp:+919178379226'
  });
});

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
}); 