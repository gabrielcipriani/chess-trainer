import { it, expect, describe } from 'vitest';
import { updateBoard } from './updateBoard.ts';
import type { Board, Square } from './types.ts';
import { emptyBoard } from './testUtils.ts';

describe('updateBoard', () => {
  it('detects piece at destination after update', () => {
    const board: Board = emptyBoard();
    board[7][0] = { type: 'p', color: 'w', hasMoved: false };
    const move = { row: 6, col: 0 };
    const newBoard = updateBoard(board, 7, 0, move);
    expect(newBoard[6][0]).toEqual({ type: 'p', color: 'w', hasMoved: true });
  });

  it('empties the origin square', () => {
    const board: Board = emptyBoard();
    board[7][0] = { type: 'p', color: 'w', hasMoved: false };
    const move = { row: 6, col: 0 };
    const newBoard = updateBoard(board, 7, 0, move);
    expect(newBoard[7][0]).toBeNull();
  });

  it('sets hasMoved to true', () => {
    const board: Board = emptyBoard();
    board[7][0] = { type: 'p', color: 'w', hasMoved: false };
    const move = { row: 6, col: 0 };
    const newBoard = updateBoard(board, 7, 0, move);
    expect(newBoard[6][0]?.hasMoved).toBe(true);
  });

  it('does not mutate the original board', () => {
    const board: Board = emptyBoard();
    const piece: Square = { type: 'p', color: 'w', hasMoved: false };
    board[7][0] = piece;
    const move = { row: 6, col: 0 };
    updateBoard(board, 7, 0, move);
    expect(board[7][0]).toBe(piece);
    expect(board[6][0]).toBeNull();
  });

  it('replaces the targetted piece during a capture', () => {
    const board: Board = emptyBoard();
    const ownPiece: Square = { type: 'p', color: 'w', hasMoved: false };
    const enemyPiece: Square = { type: 'p', color: 'b', hasMoved: false };
    board[7][0] = ownPiece;
    board[6][1] = enemyPiece;
    const move = { row: 6, col: 1 }; // simulated pawn capture
    const newBoard = updateBoard(board, 7, 0, move);
    expect(newBoard[6][1]).toEqual({ type: 'p', color: 'w', hasMoved: true });
    expect(newBoard[7][0]).toBeNull();
  });
});
