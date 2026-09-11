export type Color = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved: boolean;
}

export type Square = Piece | null;
export type Board = Square[][];

export interface Position {
  row: number;
  col: number;
}

export interface LastMove {
    from: Position;
    to: Position;
    type: PieceType;
}

export type GameStatus = 'playing' |  'check' | 'checkmate' | 'stalemate';

export type PendingPromotion = { row: number; col: number; color: Color } | null;