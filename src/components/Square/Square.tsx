import React from 'react';
import { Square as SquareType } from '../../game/types';
import { DIFFICULTY_COLORS } from '../../game/validation';
import './Square.css';

interface SquareProps {
  square: SquareType;
  isSelected: boolean;
  isSolved: boolean;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({ 
  square, 
  isSelected, 
  isSolved, 
  onClick 
}) => {
  const backgroundColor = isSolved 
    ? DIFFICULTY_COLORS[square.difficulty]
    : isSelected 
    ? '#5a5a5a' 
    : '#efefe6';
    
  const textColor = isSolved ? 'black' : isSelected ? 'white' : 'black';
  
  return (
    <button
      className="square"
      onClick={onClick}
      disabled={isSolved}
      style={{
        backgroundColor,
        color: textColor,
      }}
    >
      {square.text}
    </button>
  );
};