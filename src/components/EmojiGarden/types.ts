export type EmotionCategory = 'positive' | 'growth' | 'calming' | 'energetic';

export interface EmotionFlower {
  emoji: string;
  emotion: string;
  description: string;
  category: EmotionCategory;
}

export interface GardenCell {
  id: string;
  emoji: string | null;
  emotion: string;
  description: string;
  timestamp: Date;
  lastWatered?: Date;
  growthStage: 'seed' | 'sprout' | 'bud' | 'bloom';
  waterCount: number;
}

export interface GardenGridProps {
  cells: GardenCell[];
  onCellClick: (index: number) => void;
  onWater: (cellId: string) => void;
}