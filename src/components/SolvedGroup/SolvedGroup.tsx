import React from 'react';
import { GameGroup, Square } from '../../game/types';
import { DIFFICULTY_COLORS } from '../../game/validation';
import './SolvedGroup.css';

interface SolvedGroupProps {
  group: GameGroup;
  squares: Square[];
}

export const SolvedGroup: React.FC<SolvedGroupProps> = ({ group, squares }) => {
  const backgroundColor = DIFFICULTY_COLORS[group.difficulty];
  const squareTexts = squares
    .filter(s => group.squares.includes(s.id))
    .map(s => s.text)
    .join(', ');
  
  return (
    <div 
      className="solved-group" 
      style={{ backgroundColor }}
    >
      <div className="solved-group-connection">{group.connection}</div>
      <div className="solved-group-items">{squareTexts}</div>
    </div>
  );
};