import type { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

const accountSid = 'ACf4c5ce477bb6d5ce11ff20a550f1bef5';
const authToken = 'cfbabf95a7e97d12a3733381d8f8c442';
const client = twilio(accountSid, authToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, latitude, longitude } = req.body;

    if (!username || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const emergencyMessage = `${username} needs help. Their location is https://maps.google.com/?q=${latitude},${longitude}`;

    await client.messages.create({
      body: emergencyMessage,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+919178379226'
    });

    return res.status(200).json({ message: 'Crisis alert sent successfully' });
  } catch (error) {
    console.error('Failed to send crisis alert:', error);
    return res.status(500).json({ message: 'Failed to send crisis alert' });
  }
} 