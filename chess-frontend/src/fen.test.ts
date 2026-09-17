import { it, expect } from 'vitest';
import { getFen } from './fen.ts';
import type { Board, Color } from './types.ts'
import { boardState } from './boardState.ts';

it('checks if default starting board returns correct FEN', () => {
  const board: Board = boardState;
  const turn: Color = 'w'; // hardcode turn
  const fen = getFen(board, turn, null);
  expect(fen).toBe('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
});