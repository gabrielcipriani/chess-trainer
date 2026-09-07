import { useState } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';
import type { Position } from './types.ts';

export function App() {
  const [board, setBoard] = useState(boardState);
  const [selectedSquare, setSelectedSquare] = useState<Position|null>(null);

  function handleSquareClick(row: number, col: number): void {
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