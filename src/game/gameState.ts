import { GameState, GameConfig, Square } from './types';

export const INITIAL_LIVES = 4;

export function createInitialGameState(config: GameConfig): GameState {
  return {
    config,
    displaySquares: shuffleSquares([...config.squares]),
    selectedSquares: new Set(),
    solvedGroups: [],
    remainingLives: INITIAL_LIVES,
    gameStatus: 'playing',
    mistakes: [],
    mistakeDetails: []
  };
}

export function shuffleSquares(squares: Square[]): Square[] {
  const shuffled = [...squares];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function toggleSquareSelection(state: GameState, squareId: string): GameState {
  const newSelected = new Set(state.selectedSquares);
  
  if (newSelected.has(squareId)) {
    newSelected.delete(squareId);
  } else if (newSelected.size < 4) {
    newSelected.add(squareId);
  }
  
  return {
    ...state,
    selectedSquares: newSelected
  };
}

export function submitGuess(state: GameState): GameState {
  if (state.selectedSquares.size !== 4 || state.gameStatus !== 'playing') {
    return state;
  }
  
  const selectedIds = Array.from(state.selectedSquares);
  const selectedSquares = selectedIds.map(id => 
    state.config.squares.find(s => s.id === id)!
  );
  
  // Check if all selected squares belong to the same group
  const groupId = selectedSquares[0].groupId;
  const isCorrect = selectedSquares.every(s => s.groupId === groupId);
  
  if (isCorrect) {
    const newSolvedGroups = [...state.solvedGroups, groupId];
    const newDisplaySquares = rearrangeSquares(state.displaySquares, selectedIds, newSolvedGroups);
    
    const gameStatus = newSolvedGroups.length === 4 ? 'won' : 'playing';
    
    return {
      ...state,
      solvedGroups: newSolvedGroups,
      displaySquares: newDisplaySquares,
      selectedSquares: new Set(),
      gameStatus
    };
  } else {
    const newLives = state.remainingLives - 1;
    const newMistakes = [...state.mistakes, selectedIds];
    
    // Track difficulty breakdown of this mistake
    const difficulties = selectedSquares.map(s => s.difficulty);
    const newMistakeDetails = [...state.mistakeDetails, {
      squareIds: selectedIds,
      difficulties
    }];
    
    return {
      ...state,
      remainingLives: newLives,
      selectedSquares: new Set(),
      gameStatus: newLives === 0 ? 'lost' : 'playing',
      mistakes: newMistakes,
      mistakeDetails: newMistakeDetails
    };
  }
}

function rearrangeSquares(
  currentSquares: Square[], 
  selectedIds: string[], 
  solvedGroups: string[]
): Square[] {
  // Get all solved squares in order of when they were solved
  const solvedSquares: Square[] = [];
  for (const groupId of solvedGroups) {
    const groupSquares = currentSquares.filter(s => s.groupId === groupId);
    solvedSquares.push(...groupSquares);
  }
  
  // Get unsolved squares
  const unsolvedSquares = currentSquares.filter(
    s => !solvedGroups.includes(s.groupId)
  );
  
  // Combine: solved squares first (in rows), then unsolved
  return [...solvedSquares, ...unsolvedSquares];
}

export function isOneAwayFromGroup(state: GameState): boolean {
  if (state.selectedSquares.size !== 4) return false;
  
  const selectedIds = Array.from(state.selectedSquares);
  const selectedSquares = selectedIds.map(id => 
    state.config.squares.find(s => s.id === id)!
  );
  
  // Count squares per group
  const groupCounts = new Map<string, number>();
  selectedSquares.forEach(s => {
    groupCounts.set(s.groupId, (groupCounts.get(s.groupId) || 0) + 1);
  });
  
  // Check if exactly 3 squares are from the same group
  return Array.from(groupCounts.values()).some(count => count === 3);
}