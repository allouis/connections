import React, { useState } from 'react';
import { GameState } from '../../game/types';
import { ShareModal } from '../ShareModal/ShareModal';
import './GameOver.css';

interface GameOverProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ gameState, onPlayAgain }) => {
  const { gameStatus } = gameState;
  const isWin = gameStatus === 'won';
  const [showShareModal, setShowShareModal] = useState(false);
  
  return (
    <>
      <div className="game-over-message">
        <h3>{isWin ? 'Congratulations!' : 'Game Over'}</h3>
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
    </>
  );
};