export type Difficulty = 'yellow' | 'green' | 'blue' | 'purple';

export interface Square {
  id: string;
  text: string;
  groupId: string;
  difficulty: Difficulty;
}

export interface GameGroup {
  id: string;
  difficulty: Difficulty;
  connection: string;
  squares: string[]; // Square IDs
}

export interface GameConfig {
  groups: GameGroup[];
  squares: Square[];
}

export interface MistakeDetail {
  squareIds: string[];
  difficulties: Difficulty[];
}

export interface GameState {
  config: GameConfig;
  displaySquares: Square[]; // Current order on board
  selectedSquares: Set<string>;
  solvedGroups: string[];
  remainingLives: number;
  gameStatus: 'playing' | 'won' | 'lost';
  mistakes: string[][]; // History of wrong guesses
  mistakeDetails: MistakeDetail[]; // Detailed mistake information
}

export interface AdminGameState {
  groups: GameGroup[];
  squares: Square[];
}