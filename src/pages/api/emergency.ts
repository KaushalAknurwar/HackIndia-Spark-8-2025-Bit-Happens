import { Twilio } from 'twilio';
import type { Request, Response } from 'express';

const twilio = new Twilio(
	process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID!,
	process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN!
);

export default async function handler(req: Request, res: Response) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name, phone, situation } = req.body;

	try {
		const message = await twilio.messages.create({
			body: `Emergency Request:\nName: ${name}\nPhone: ${phone}\nSituation: ${situation}`,
			to: '+1234567890', // Therapist phone number
			from: process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER!,
		});

		return res.status(200).json({ success: true, messageId: message.sid });
	} catch (error) {
		console.error('Twilio error:', error);
		return res.status(500).json({ error: 'Failed to send emergency notification' });
	}
}