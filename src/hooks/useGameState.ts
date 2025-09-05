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
  
  const [showOneAway, setShowOneAway] = useState(false);
  
  const handleSquareClick = useCallback((squareId: string) => {
    setGameState(state => toggleSquareSelection(state, squareId));
    setShowOneAway(false);
  }, []);
  
  const handleSubmit = useCallback(() => {
    const newState = submitGuess(gameState);
    
    // Check if guess was wrong and player is one away
    if (newState.mistakes.length > gameState.mistakes.length && 
        isOneAwayFromGroup(gameState)) {
      setShowOneAway(true);
      setTimeout(() => setShowOneAway(false), 2000);
    }
    
    setGameState(newState);
  }, [gameState]);
  
  const handleShuffle = useCallback(() => {
    setGameState(state => ({
      ...state,
      displaySquares: [...state.displaySquares].sort(() => Math.random() - 0.5)
    }));
  }, []);
  
  const handleDeselectAll = useCallback(() => {
    setGameState(state => ({
      ...state,
      selectedSquares: new Set()
    }));
  }, []);
  
  const resetGame = useCallback(() => {
    setGameState(createInitialGameState(initialConfig));
    setShowOneAway(false);
  }, [initialConfig]);
  
  return {
    gameState,
    showOneAway,
    handleSquareClick,
    handleSubmit,
    handleShuffle,
    handleDeselectAll,
    resetGame
  };
}