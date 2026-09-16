import { describe, it, expect } from 'vitest';
import { isKingInCheck } from './isKingInCheck.ts';

const emptyBoard = Array.from({ length: 8 }, () => Array(8).fill(null));

it('throws when white king is missing', () => {
  expect(() => isKingInCheck(emptyBoard, 'w')).toThrow();
});

it('throws when black king is missing', () => {
  expect(() => isKingInCheck(emptyBoard, 'b')).toThrow();
});
