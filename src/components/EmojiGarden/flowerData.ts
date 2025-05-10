import { EmotionFlower } from './types';

export const emotionFlowers: EmotionFlower[] = [
  // Positive Emotions
  {
    emoji: "🌻",
    emotion: "Happy",
    description: "Radiating joy and positivity like a sunflower following the sun",
    category: "positive"
  },
  {
    emoji: "🌹",
    emotion: "Grateful",
    description: "Feeling deep appreciation and love",
    category: "positive"
  },
  {
    emoji: "🌼",
    emotion: "Peaceful",
    description: "Simple joy and serenity like a daisy in a meadow",
    category: "positive"
  },
  {
    emoji: "🌸",
    emotion: "Tranquil",
    description: "Gentle calmness like cherry blossoms in the breeze",
    category: "positive"
  },
  {
    emoji: "🌷",
    emotion: "Hopeful",
    description: "Growing optimism and new beginnings",
    category: "positive"
  },
  // Growth Emotions
  {
    emoji: "🌱",
    emotion: "Growing",
    description: "Feeling of personal development and progress",
    category: "growth"
  },
  {
    emoji: "🌿",
    emotion: "Learning",
    description: "Embracing new knowledge and experiences",
    category: "growth"
  },
  // Calming Emotions
  {
    emoji: "🍀",
    emotion: "Lucky",
    description: "Feeling blessed and fortunate",
    category: "calming"
  },
  {
    emoji: "🌺",
    emotion: "Content",
    description: "Deep satisfaction and inner peace",
    category: "calming"
  },
  // Energetic Emotions
  {
    emoji: "🌵",
    emotion: "Resilient",
    description: "Strong and adaptable in challenging times",
    category: "energetic"
  },
  {
    emoji: "🌴",
    emotion: "Free",
    description: "Feeling unburdened and liberated",
    category: "energetic"
  }
];

export const growthStages = {
  seed: "🌱",
  sprout: "🌿",
  bud: "🪴",
  bloom: ["🌸", "🌹", "🌺", "🌻", "🌼", "🌷"]
};