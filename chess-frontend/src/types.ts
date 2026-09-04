export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Move {
  row: number;
  col: number;
}
