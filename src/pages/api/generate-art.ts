import type { Request, Response } from 'express';
import { generateImage } from '@/services/imageService';

interface ArtGenerationRequest {
	prompt: string;
	image_generator_version?: "standard" | "hd" | "genius";
	negative_prompt?: string;
}

interface ArtGenerationResponse {
	success: boolean;
	imageUrl?: string;
	error?: string;
}

export default async function handler(
	req: Request,
	res: Response
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const { prompt, image_generator_version, negative_prompt } = req.body as ArtGenerationRequest;
		
		const imageUrl = await generateImage({
			prompt,
			image_generator_version,
			negative_prompt
		});

		const response: ArtGenerationResponse = {
			success: true,
			imageUrl
		};

		res.status(200).json(response);
	} catch (error) {
		console.error('Error generating art:', error);
		res.status(500).json({ 
			success: false,
			error: 'Failed to generate art' 
		});
	}
}
