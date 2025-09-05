import React from 'react';
import { Board } from '../Board/Board';
import { LivesDisplay } from '../LivesDisplay/LivesDisplay';
import { GameOver } from '../GameOver/GameOver';
import { GameConfig } from '../../game/types';
import { INITIAL_LIVES } from '../../game/gameState';
import { useGameState } from '../../hooks/useGameState';
import './Game.css';

interface GameProps {
  config: GameConfig;
}

export const Game: React.FC<GameProps> = ({ config }) => {
  const {
    gameState,
    showOneAway,
    handleSquareClick,
    handleSubmit,
    handleShuffle,
    handleDeselectAll,
    resetGame
  } = useGameState(config);
  
  if (gameState.gameStatus !== 'playing') {
    return <GameOver gameState={gameState} onPlayAgain={resetGame} />;
  }
  
  const canSubmit = gameState.selectedSquares.size === 4;
  
  return (
    <div className="game">
      <h1>Connections</h1>
      <p className="instructions">
        Create four groups of four!
      </p>
      
      {showOneAway && (
        <div className="one-away-message">
          One away...
        </div>
      )}
      
      <Board
        squares={gameState.displaySquares}
        selectedSquares={gameState.selectedSquares}
        solvedGroups={gameState.solvedGroups}
        onSquareClick={handleSquareClick}
      />
      
      <LivesDisplay
        remainingLives={gameState.remainingLives}
        maxLives={INITIAL_LIVES}
      />
      
      <div className="game-controls">
        <button onClick={handleShuffle} className="control-button secondary">
          Shuffle
        </button>
        <button 
          onClick={handleDeselectAll} 
          className="control-button secondary"
          disabled={gameState.selectedSquares.size === 0}
        >
          Deselect All
        </button>
        <button 
          onClick={handleSubmit} 
          className={`control-button primary ${canSubmit ? 'ready' : ''}`}
          disabled={!canSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};