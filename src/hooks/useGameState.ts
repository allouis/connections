import { useState, useCallback } from 'react';
import { GameState, GameConfig } from '../game/types';
import { 
  createInitialGameState, 
  toggleSquareSelection, 
  submitGuess,
  isOneAwayFromGroup 
} from '../game/gameState';

export function useGameState(initialConfig: GameConfig) {
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialGameState(initialConfig)
  );
  
  const [message, setMessage] = useState<string>('');
  
  const handleSquareClick = useCallback((squareId: string) => {
    setGameState(state => toggleSquareSelection(state, squareId));
    setMessage('');
  }, []);
  
  const handleSubmit = useCallback(() => {
    // Check for duplicate guess
    const selectedIds = Array.from(gameState.selectedSquares).sort();
    const isDuplicate = gameState.mistakes.some(mistake => {
      const mistakeIds = [...mistake].sort();
      return mistakeIds.length === selectedIds.length && 
             mistakeIds.every((id, index) => id === selectedIds[index]);
    });
    
    if (isDuplicate) {
      setMessage('Already guessed!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    const newState = submitGuess(gameState);
    
    // Check if guess was wrong and player is one away
    if (newState.mistakes.length > gameState.mistakes.length) {
      if (isOneAwayFromGroup(gameState)) {
        setMessage('One away...');
        setTimeout(() => setMessage(''), 2000);
      }
    }
    
    setGameState(newState);
  }, [gameState]);
  
  const handleShuffle = useCallback(() => {
    setGameState(state => {
      const solvedSquares = state.displaySquares.filter(s => 
        state.solvedGroups.includes(s.groupId)
      );
      const unsolvedSquares = state.displaySquares.filter(s => 
        !state.solvedGroups.includes(s.groupId)
      );
      const shuffledUnsolved = [...unsolvedSquares].sort(() => Math.random() - 0.5);
      
      return {
        ...state,
        displaySquares: [...solvedSquares, ...shuffledUnsolved]
      };
    });
  }, []);
  
  const handleDeselectAll = useCallback(() => {
    setGameState(state => ({
      ...state,
      selectedSquares: new Set()
    }));
  }, []);
  
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState(initialConfig));
    setMessage('');
  }, [initialConfig]);
  
  return {
    gameState,
    message,
    handleSquareClick,
    handleSubmit,
    handleShuffle,
    handleDeselectAll,
    resetGame
  };
}