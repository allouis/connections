import React, { useState } from 'react';
import { GameState } from '../../game/types';
import { DIFFICULTY_COLORS } from '../../game/validation';
import { ShareModal } from '../ShareModal/ShareModal';
import './GameOver.css';

interface GameOverProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ gameState, onPlayAgain }) => {
  const { gameStatus, config, solvedGroups } = gameState;
  const isWin = gameStatus === 'won';
  const [showShareModal, setShowShareModal] = useState(false);
  
  return (
    <div className="game-over">
      <h2>{isWin ? 'Congratulations!' : 'Game Over'}</h2>
      
      <div className="groups-summary">
        {config.groups.map(group => {
          const isSolved = solvedGroups.includes(group.id);
          return (
            <div 
              key={group.id} 
              className={`group-summary ${!isSolved ? 'unsolved' : ''}`}
              style={{
                backgroundColor: DIFFICULTY_COLORS[group.difficulty],
                opacity: isSolved ? 1 : 0.6
              }}
            >
              <div className="group-connection">{group.connection}</div>
              <div className="group-items">
                {group.squares.map(squareId => {
                  const square = config.squares.find(s => s.id === squareId)!;
                  return square.text;
                }).join(', ')}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="game-over-buttons">
        <button className="share-button" onClick={() => setShowShareModal(true)}>
          Share
        </button>
        <button className="play-again-button" onClick={onPlayAgain}>
          Play Again
        </button>
      </div>
      
      {showShareModal && (
        <ShareModal 
          gameState={gameState} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </div>
  );
};