import { playerHasLegalMove } from './playerHasLegalMove.ts';
import { isKingInCheck } from './isKingInCheck.ts';
import type { Board, Color, LastMove, GameStatus } from './types.ts';

export function checkStatus(
  board: Board,
  turn: Color,
  lastMove: LastMove,
): GameStatus {
  // Check if checkmate or stalemate
  if (!playerHasLegalMove(board, turn, lastMove)) {
    if (isKingInCheck(board, turn)) {
      return 'checkmate';
    } else {
      return 'stalemate';
    }
  } else {
    return 'playing';
  }
}
