import React from 'react';
import './LivesDisplay.css';

interface LivesDisplayProps {
  remainingLives: number;
  maxLives: number;
}

export const LivesDisplay: React.FC<LivesDisplayProps> = ({ 
  remainingLives, 
  maxLives 
}) => {
  return (
    <div className="lives-display">
      <span>Mistakes remaining:</span>
      <div className="lives-dots">
        {Array.from({ length: maxLives }, (_, i) => (
          <div
            key={i}
            className={`life-dot ${i >= remainingLives ? 'lost' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};