import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';

export function App() {
  return (
    <>
      <h1>Chess Trainer</h1>
      <Board board={boardState} />
    </>
  );
}