import { GameConfig, Square, Difficulty } from './types';

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  yellow: '#F9DA6A',
  green: '#A0C35A', 
  blue: '#B0C4EF',
  purple: '#BA81C5'
};

export const DIFFICULTY_ORDER: Difficulty[] = ['yellow', 'green', 'blue', 'purple'];

export function validateGameConfig(config: GameConfig): string | null {
  // Check we have exactly 4 groups
  if (config.groups.length !== 4) {
    return 'Game must have exactly 4 groups';
  }
  
  // Check each group has exactly 4 squares
  for (const group of config.groups) {
    if (group.squares.length !== 4) {
      return `Group "${group.connection}" must have exactly 4 squares`;
    }
  }
  
  // Check we have exactly 16 squares
  if (config.squares.length !== 16) {
    return 'Game must have exactly 16 squares';
  }
  
  // Check all square IDs are unique
  const squareIds = new Set(config.squares.map(s => s.id));
  if (squareIds.size !== 16) {
    return 'All square IDs must be unique';
  }
  
  // Check all squares are assigned to groups
  const assignedSquareIds = new Set(
    config.groups.flatMap(g => g.squares)
  );
  
  for (const square of config.squares) {
    if (!assignedSquareIds.has(square.id)) {
      return `Square "${square.text}" is not assigned to any group`;
    }
  }
  
  // Check each difficulty is used exactly once
  const difficulties = new Set(config.groups.map(g => g.difficulty));
  if (difficulties.size !== 4) {
    return 'Each difficulty level must be used exactly once';
  }
  
  for (const diff of DIFFICULTY_ORDER) {
    if (!difficulties.has(diff)) {
      return `Missing group with difficulty "${diff}"`;
    }
  }
  
  return null;
}

export function createEmptyGameConfig(): GameConfig {
  const groups = DIFFICULTY_ORDER.map((difficulty, index) => ({
    id: `group-${index}`,
    difficulty,
    connection: '',
    squares: [] as string[]
  }));
  
  const squares: Square[] = [];
  let squareIndex = 0;
  
  for (const group of groups) {
    for (let i = 0; i < 4; i++) {
      const square: Square = {
        id: `square-${squareIndex}`,
        text: '',
        groupId: group.id,
        difficulty: group.difficulty
      };
      squares.push(square);
      group.squares.push(square.id);
      squareIndex++;
    }
  }
  
  return { groups, squares };
}