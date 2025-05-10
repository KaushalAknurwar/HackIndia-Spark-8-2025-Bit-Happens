export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = 'menu' | 'playing' | 'completed';

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameStats {
  attempts: number;
  matches: number;
  startTime: number | null;
  bestTime: number | null;
}