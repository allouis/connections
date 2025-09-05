import React from 'react';
import { Square } from '../Square/Square';
import { Square as SquareType } from '../../game/types';
import './Board.css';

interface BoardProps {
  squares: SquareType[];
  selectedSquares: Set<string>;
  solvedGroups: string[];
  onSquareClick: (squareId: string) => void;
}

export const Board: React.FC<BoardProps> = ({
  squares,
  selectedSquares,
  solvedGroups,
  onSquareClick
}) => {
  return (
    <div className="board">
      {squares.map((square) => (
        <Square
          key={square.id}
          square={square}
          isSelected={selectedSquares.has(square.id)}
          isSolved={solvedGroups.includes(square.groupId)}
          onClick={() => onSquareClick(square.id)}
        />
      ))}
    </div>
  );
};