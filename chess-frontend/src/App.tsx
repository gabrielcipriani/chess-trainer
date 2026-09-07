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

    if (selectedSquare === null) {
      if (!piece || piece.color !== turn) {
        return;
      }
      setSelectedSquare({ row, col });
      return;
    }
    // same square clicked twice: deselect
    else if (row === selectedSquare.row && col === selectedSquare.col) {
      setSelectedSquare(null);
    }
    // different piece clicked of same color: switch
    else if (piece && piece.color === turn) {
      setSelectedSquare({ row, col });
    }
    // fallback
    else {
      setSelectedSquare(null);
    }
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