import { Board } from './Board';

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

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';

export interface GameState {
  board: Board;
  turn: Color;
  lastMove: LastMove | null;
  halfmoveClock: number;
  fullmoveNumber: number;
}

export interface GameHistory {
  history: GameState[];
  currentIndex: number;
  direction: 'fwd' | 'back';
}

export type GameAction =
  | { type: 'MOVE'; from: Position; to: Position }
  | { type: 'UNDO' }
  | { type: 'REDO' };
//TODO RESET

export interface ExplorerOpening {
  eco: string;
  name: string;
}

export interface ExplorerMove {
  san: string;
  uci: string;
  white: number;
  draws: number;
  black: number;
  opening: ExplorerOpening | null;
}

export interface ExplorerResponse {
  white: number;
  draws: number;
  black: number;
  moves: ExplorerMove[];
  opening: ExplorerOpening | null;
}

export interface CandidateMove {
  san: string;
  uci: string;
  playedPercent: number;
  whitePercent: number;
  drawPercent: number;
  blackPercent: number;
}

export interface RepertoireNode {
  candidateMoves: CandidateMove[]
  move: string;
  children: RepertoireNode[]
}