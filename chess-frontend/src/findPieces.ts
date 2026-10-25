import type { Board, Color, PieceType } from './types.ts';

export function findPiece(
  board: Board,
  turn: Color,
  type: PieceType,
): [number, number] | null {
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, square] of row.entries()) {
      if (square?.type === type && square?.color === turn) {
        return [rowIndex, colIndex];
      }
    }
  }
  return null;
}

export function findAllPiece(
  board: Board,
  turn: Color,
  type: PieceType,
): [number, number][] {
  let foundPieces: [number, number][] = [];
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, square] of row.entries()) {
      if (square?.type === type && square?.color === turn) {
        foundPieces.push([rowIndex, colIndex]);
      }
    }
  }
  return foundPieces;
}

const boardState: Board = [
  [
    { type: 'r', color: 'b', hasMoved: false },
    { type: 'n', color: 'b', hasMoved: false },
    { type: 'b', color: 'b', hasMoved: false },
    { type: 'q', color: 'b', hasMoved: false },
    { type: 'k', color: 'b', hasMoved: false },
    { type: 'b', color: 'b', hasMoved: false },
    { type: 'n', color: 'b', hasMoved: false },
    { type: 'r', color: 'b', hasMoved: false },
  ],
  [
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
    { type: 'p', color: 'b', hasMoved: false },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
    { type: 'p', color: 'w', hasMoved: false },
  ],
  [
    { type: 'r', color: 'w', hasMoved: false },
    { type: 'n', color: 'w', hasMoved: false },
    { type: 'b', color: 'w', hasMoved: false },
    { type: 'q', color: 'w', hasMoved: false },
    { type: 'k', color: 'w', hasMoved: false },
    { type: 'b', color: 'w', hasMoved: false },
    { type: 'n', color: 'w', hasMoved: false },
    { type: 'r', color: 'w', hasMoved: false },
  ],
];

console.log(findAllPiece(boardState, 'w', 'n'));
