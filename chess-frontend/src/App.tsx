import { useState } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';

export function App() {
  const [board, setBoard] = useState(boardState);

  return (
    <>
      <h1>Chess Trainer</h1>
      <Board board={board} />
    </>
  );
}