import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyzeEmotion } from './wit';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const THERAPIST_PROMPT = `You are Asha, a caring and empathetic AI therapist. Respond naturally as if having a real conversation, without labeling or showing your therapeutic techniques.

Style guide:
- Keep responses short and warm (2-3 sentences)
- Use natural, conversational language
- Speak as if talking to a friend
- Show genuine care and understanding
- Be gentle and supportive

DO NOT:
- Label your responses with techniques (like "Validation:", "Reflection:", etc.)
- Use clinical or technical language
- Write long paragraphs
- Give medical advice

Example natural responses:
"Hi there! I'm sorry you're going through this. Would you like to tell me more about what's happening?"
"That must be really hard to deal with. What do you think would help you feel better right now?"
"I understand how you're feeling. Let's talk about what's on your mind today."`;

export async function chatHandler(userMessage: string) {
  try {
    // Ensure the message is not empty
    if (!userMessage.trim()) {
      throw new Error('Message cannot be empty');
    }

    // Analyze emotion using Wit.ai
    const emotionAnalysis = await analyzeEmotion(userMessage);
    
    // Start a chat session with therapeutic context
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: 'Hi, I need someone to talk to.',
        },
        {
          role: 'model',
          parts: "Hi! I'm Asha, and I'm here to support you. How are you feeling today?",
        }
      ],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    // Add the therapist prompt with emotion context
    const contextPrompt = `${THERAPIST_PROMPT}\n\nThe user's message has been analyzed and shows the following emotional context:\n${JSON.stringify(emotionAnalysis, null, 2)}\n\nPlease consider this emotional context in your response while maintaining your natural, empathetic style.`;
    
    await chat.sendMessage(contextPrompt);
    
    // Send the user's message and get the response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Chat API error:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
} 