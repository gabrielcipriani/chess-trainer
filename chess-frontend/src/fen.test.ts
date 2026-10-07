import { it, expect } from 'vitest';
import { getFen } from './fen.ts';
import type { GameState } from './types.ts'
import { boardState } from './boardState.ts';

const initialGameState: GameState = {
  board: boardState,
  turn: 'w',
  lastMove: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
  san: null,
};

it('checks if default starting board returns correct FEN', () => {
  const fen = getFen(initialGameState);
  expect(fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
});

// TODO - fix fen.ts
// it('checks if en passant available', () => {
//   let board: Board = boardState;
//   board = updateBoard(board, 6, 4, { row: 5, col: 4 }); // 1.e3
//   board = updateBoard(board, 1, 4, { row: 3, col: 4 }); // 1.e5
//   board = updateBoard(board, 7, 6, { row: 5, col: 5 }); // 2.Nf3
//   board = updateBoard(board, 3, 4, { row: 4, col: 4 }); // 2.e4
//   board = updateBoard(board, 6, 3, { row: 4, col: 3 }); // 3.d4
//   const turn: Color = 'b'; // hardcode turn
//   const lastMove: LastMove = {
//     from: { row: 6, col: 3 },
//     to: { row: 4, col: 3},
//     type: 'p'
//   }
//   const fen = getFen(board, turn, lastMove);
//   expect(fen).toBe('rnbqkbnr/pppp1ppp/8/8/3Pp3/4PN2/PPP2PPP/RNBQKB1R b KQkq d3 0 3');
// });