import React from 'react';
import { Board } from '../Board/Board';
import { Square } from '../Square/Square';
import { SolvedGroup } from '../SolvedGroup/SolvedGroup';
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
    message,
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
      
      <div className="message-area">
        {message && (
          <div className="game-message">
            {message}
          </div>
        )}
      </div>
      
      <div className="game-board-area">
        {gameState.solvedGroups.map(groupId => {
          const group = gameState.config.groups.find(g => g.id === groupId);
          if (!group) return null;
          return (
            <SolvedGroup
              key={groupId}
              group={group}
              squares={gameState.config.squares}
            />
          );
        })}
        
        {gameState.solvedGroups.length < 4 && (
          <div className={gameState.solvedGroups.length > 0 ? "board-remaining" : "board"}>
            {gameState.displaySquares
              .filter(square => !gameState.solvedGroups.includes(square.groupId))
              .map((square) => (
                <Square
                  key={square.id}
                  square={square}
                  isSelected={gameState.selectedSquares.has(square.id)}
                  isSolved={false}
                  onClick={() => handleSquareClick(square.id)}
                />
              ))}
          </div>
        )}
      </div>
      
      <LivesDisplay
        remainingLives={gameState.remainingLives}
        maxLives={INITIAL_LIVES}
      />
      
      <div className="game-controls">
        <button 
          onClick={handleShuffle} 
          className="control-button secondary"
          disabled={gameState.solvedGroups.length === 4}
        >
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