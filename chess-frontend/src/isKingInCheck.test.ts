import { describe, it, expect } from 'vitest';
import { isKingInCheck } from './isKingInCheck.ts';

describe('missing king', () => {
  it('throws when white king is missing', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    expect(() => isKingInCheck(board, 'w')).toThrow();
  });

  it('throws when black king is missing', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    expect(() => isKingInCheck(board, 'b')).toThrow();
  });
});

describe('adjacent king', () => {
  it('detects enemy king adjacent', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[0][1] = { type: 'k', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });
});

describe('pawn checks', () => {
  it('detects a white pawn attacking the black king', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'b', hasMoved: false };
    board[1][1] = { type: 'p', color: 'k', hasMoved: false };
    expect(isKingInCheck(board, 'b')).toBe(true);
  });

  it('detects a black pawn attacking the white king', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'p', color: 'b', hasMoved: false };
    board[1][1] = { type: 'k', color: 'w', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });
});

describe('knight checks', () => {
  it('detects enemy knight attacking king', () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[2][1] = { type: 'n', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });
});

describe('rank/file checks', () => {
  it('detects a rook giving check along open rank' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[0][2] = { type: 'r', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });

  it('detects a queen giving check along open rank' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[0][2] = { type: 'q', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });


  it('detects own piece blocking a check along a rank' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[0][1] = { type: 'p', color: 'w', hasMoved: false };
    board[0][2] = { type: 'r', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(false);
  });

  it('detects non-threatening enemy piece blocking a check along rank' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[0][1] = { type: 'p', color: 'b', hasMoved: false };
    board[0][2] = { type: 'r', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(false);
  });
});

describe('diagonal checks', () => {
  it('detects a bishop giving check along an open diagonal' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[2][2] = { type: 'b', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });

  it('detects a queen giving check along an open diagonal' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[2][2] = { type: 'q', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(true);
  });


  it('detects own piece blocking a check along an open diagonal' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[1][1] = { type: 'p', color: 'w', hasMoved: false };
    board[2][2] = { type: 'b', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(false);
  });

  it('detects non-threatening enemy piece blocking a check along an open diagonal' , () => {
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[0][0] = { type: 'k', color: 'w', hasMoved: false };
    board[1][1] = { type: 'p', color: 'b', hasMoved: false };
    board[2][2] = { type: 'q', color: 'b', hasMoved: false };
    expect(isKingInCheck(board, 'w')).toBe(false);
  });
});

it('returns false when no pece is attacking the king', () => {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  board[0][0] = { type: 'k', color: 'w', hasMoved: false };
  expect(isKingInCheck(board, 'w')).toBe(false);
});
