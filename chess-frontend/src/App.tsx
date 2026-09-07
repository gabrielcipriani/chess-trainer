import { useState } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';

export function App() {
  const [board, setBoard] = useState(boardState);

  function handleSquareClick(row: number, col: number): void {
    console.log(row, col);
  }

  return (
    <>
      <h1>Chess Trainer</h1>
      <Board board={board} onSquareClick={handleSquareClick}/>
    </>
  );
}