import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const result = await hf.textClassification({
      model: 'SamLowe/roberta-base-go_emotions',
      inputs: text,
    });

    // Map the emotion labels to mood emojis
    const emotionToMood: { [key: string]: string } = {
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

    return NextResponse.json({
      mood,
      emotions: result.map(r => ({
        label: r.label,
        score: r.score
      }))
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sentiment' },
      { status: 500 }
    );
  }
} 