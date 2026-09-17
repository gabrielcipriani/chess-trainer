import { it, expect } from 'vitest';
import { updateBoard } from './updateBoard.ts';
import type { Board, Square } from './types.ts';

it('detects piece at destination after update', () => {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[7][0] = { type: 'p', color: 'w', hasMoved: false };
  const move = { row: 6, col: 0 };
  const newBoard = updateBoard(board, 7, 0, move);
  expect(newBoard[6][0]).toEqual({ type: 'p', color: 'w', hasMoved: true });
});

it('checks origin becomes empty', () => {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[7][0] = { type: 'p', color: 'w', hasMoved: false };
  const move = { row: 6, col: 0 };
  const newBoard = updateBoard(board, 7, 0, move);
  expect(newBoard[7][0]).toBeNull();
});

it('checks if hasMoved becomes true', () => {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[7][0] = { type: 'p', color: 'w', hasMoved: false };
  const move = { row: 6, col: 0 };
  const newBoard = updateBoard(board, 7, 0, move);
  expect(newBoard[6][0]?.hasMoved).toBe(true);
});

it('checks if original board is not mutated', () => {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const piece: Square = { type: 'p', color: 'w', hasMoved: false };
  board[7][0] = piece;
  const move = { row: 6, col: 0 };
  updateBoard(board, 7, 0, move);
  expect(board[7][0]).toBe(piece);
  expect(board[6][0]).toBeNull();
});

it('checks if targetted piece is replaced during a capture', () => {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const ownPiece: Square = { type: 'p', color: 'w', hasMoved: false };
  const enemyPiece: Square = { type: 'p', color: 'b', hasMoved: false };
  board[7][0] = ownPiece;
  board[6][1] = enemyPiece;
  const move = { row: 6, col: 1 }; // simulated pawn capture
  const newBoard = updateBoard(board, 7, 0, move);
  expect(newBoard[6][1]).toEqual({ type: 'p', color: 'w', hasMoved: true });
  expect(newBoard[7][0]).toBeNull();
});
