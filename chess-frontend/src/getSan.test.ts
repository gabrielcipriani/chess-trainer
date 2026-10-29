import { describe, it, expect } from 'vitest';
import { getSan } from './getSan';
import { movePiece } from './moveHandler';
import { boardState } from './boardState';
import type { Board } from './types';
import { emptyBoard } from './testUtils';

describe('getSan', () => {
  it('adds the file for knights on b1 and f3 both reaching d2', () => {
    const board: Board = emptyBoard();
    board[7][7] = { type: 'k', color: 'w', hasMoved: false };
    board[0][0] = { type: 'k', color: 'b', hasMoved: false };
    board[7][1] = { type: 'n', color: 'w', hasMoved: false };
    board[5][5] = { type: 'n', color: 'w', hasMoved: false };
    const moveResult = movePiece(board, 7, 1, 6, 3, null);
    expect(getSan(board, moveResult, 'b', null)).toBe('Nbd2');
  });

  it('adds the rank when both rooks are on the same file', () => {
    const board = emptyBoard();
    board[7][7] = { type: 'k', color: 'w', hasMoved: false };
    board[0][7] = { type: 'k', color: 'b', hasMoved: false };
    board[7][0] = { type: 'r', color: 'w', hasMoved: false };
    board[3][0] = { type: 'r', color: 'w', hasMoved: false };
    const moveResult = movePiece(board, 7, 0, 5, 0, null);
    expect(getSan(board, moveResult, 'b', null)).toBe('R1a3');
  });

  it('adds both file and rank when neither alone is unique', () => {
    const board = emptyBoard();
    board[7][7] = { type: 'k', color: 'w', hasMoved: false };
    board[0][4] = { type: 'k', color: 'b', hasMoved: false };
    board[7][0] = { type: 'q', color: 'w', hasMoved: false };
    board[5][0] = { type: 'q', color: 'w', hasMoved: false };
    board[7][2] = { type: 'q', color: 'w', hasMoved: false };
    const moveResult = movePiece(board, 7, 0, 6, 1, null);
    expect(getSan(board, moveResult, 'b', null)).toBe('Qa1b2');
  });

  it('does not disambiguate when the other knight is pinned', () => {
    const board = emptyBoard();
    board[7][7] = { type: 'k', color: 'w', hasMoved: false };
    board[0][7] = { type: 'k', color: 'b', hasMoved: false };
    board[7][1] = { type: 'n', color: 'w', hasMoved: false };
    board[5][5] = { type: 'n', color: 'w', hasMoved: false };
    board[3][3] = { type: 'b', color: 'b', hasMoved: false };
    const moveResult = movePiece(board, 7, 1, 6, 3, null);
    expect(getSan(board, moveResult, 'b', null)).toBe('Nd2');
  });

  it('does not disambiguate a normal move', () => {
    const moveResult = movePiece(boardState, 7, 6, 5, 5, null);
    expect(getSan(boardState, moveResult, 'b', null)).toBe('Nf3');
  });
});
