export type Difficulty = 'easy' | 'medium' | 'hard';
export type Theme = 'calm' | 'joy' | 'focus';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  score: number;
  level: number;
  difficulty: Difficulty;
  theme: Theme;
}