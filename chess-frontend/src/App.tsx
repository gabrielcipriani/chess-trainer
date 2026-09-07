import { useState } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';
import type { Position, Color } from './types.ts';

export function App() {
  const [board, setBoard] = useState(boardState);
  const [selectedSquare, setSelectedSquare] = useState<Position|null>(null);
  const [turn, setTurn] = useState<Color>('w');

  function handleSquareClick(row: number, col: number): void {
    const piece = board[row][col];
    if (!piece || piece.color !== turn) {
      return;
    }
    setSelectedSquare({ row, col });
  }

  return (
    <>
      <h1>Chess Trainer</h1>
      {selectedSquare && (
      <p>({selectedSquare.row}, {selectedSquare.col})</p>
      )}
      <Board board={board} onSquareClick={handleSquareClick}/>
    </>
  );
}