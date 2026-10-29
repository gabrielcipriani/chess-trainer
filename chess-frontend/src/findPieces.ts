import type { Board, Color, PieceType, Position } from './types.ts';

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
): Position[] {
  let foundPieces: Position[] = [];
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, square] of row.entries()) {
      if (square?.type === type && square?.color === turn) {
        foundPieces.push({ row: rowIndex, col: colIndex });
      }
    }
  }
  return foundPieces;
}
