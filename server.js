import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, 'dist')));

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// API Routes
app.use('/api', (req, res, next) => {
	const apiPath = join(__dirname, 'src', 'pages', 'api');
	import(join(apiPath, `${req.path}.ts`))
		.then(module => {
			module.default(req, res);
		})
		.catch(error => {
			console.error('API route error:', error);
			res.status(500).json({ error: 'Internal server error' });
		});
});

app.post('/api/sentiment', async (req, res) => {
	try {
		const { text } = req.body;

		if (!text) {
			return res.status(400).json({ error: 'Text is required' });
		}

		const result = await hf.textClassification({
			model: 'SamLowe/roberta-base-go_emotions',
			inputs: text,
		});

		// Map the emotion labels to mood emojis
		const emotionToMood = {
			'joy': '😊',
			'sadness': '😢',
			'anger': '😡',
			'fear': '😰',
			'surprise': '🤔',
			'neutral': '😌',
			'excitement': '🥳',
			'tiredness': '😴'
		};

		// Get the top emotion
		const topEmotion = result[0].label;
		const mood = emotionToMood[topEmotion] || '😌';

		res.json({
			mood,
			emotions: result.map(r => ({
				label: r.label,
				score: r.score
			}))
		});
	} catch (error) {
		console.error('Sentiment analysis error:', error);
		res.status(500).json({ error: 'Failed to analyze sentiment' });
	}
});

// Serve frontend
app.get('*', (req, res) => {
	res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
