import React from 'react';
import { Square } from '../../game/types';
import { DIFFICULTY_COLORS } from '../../game/validation';

interface AdminSquareProps {
  square: Square;
  onTextChange: (text: string) => void;
}

export const AdminSquare: React.FC<AdminSquareProps> = ({ square, onTextChange }) => {
  return (
    <input
      type="text"
      value={square.text}
      onChange={(e) => onTextChange(e.target.value)}
      className="admin-square"
      style={{
        backgroundColor: DIFFICULTY_COLORS[square.difficulty],
        color: 'white'
      }}
      placeholder="Enter text..."
    />
  );
};