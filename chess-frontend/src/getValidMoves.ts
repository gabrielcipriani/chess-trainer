import { isKingInCheck } from './isKingInCheck.ts';
import { updateBoard } from './updateBoard.ts';
import { getPseudoLegalMoves } from './getPseudoLegalMoves.ts';
import { getCastlingMoves } from './specialMoves.ts';

import type { Board, Color, Position, LastMove } from './types.ts';
/**
 * Returns an array of valid moves for a piece at (fromRow, fromCol).
 * A valid move is one that does not leave the player's king in check.
 */
export function getValidMoves(board: Board, fromRow: number, fromCol: number, turn: Color, lastMove: LastMove | null) {
  const currentPiece = board[fromRow][fromCol];
  if (!currentPiece) {
    return [];
  }
  const pseudoLegalMoves = getPseudoLegalMoves(board, fromRow, fromCol);
  const validMoves: Position[] = [];
  for (const move of pseudoLegalMoves) {
    const futureBoard = updateBoard(board, fromRow, fromCol, move);
    if (!isKingInCheck(futureBoard, turn)) {
      validMoves.push(move);
    }
  }

  // Castling check
  if (currentPiece.type === 'k') {
    const castlingMoves = getCastlingMoves(board, turn);
    if (castlingMoves) {
      validMoves.push(...castlingMoves);
    }
  }
  
  // En passant check
  if (
    currentPiece.type === 'p' &&
    lastMove?.type === 'p' &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    fromRow === lastMove.to.row &&
    Math.abs(fromCol - lastMove.to.col) === 1
  ) {
    if (turn === 'w') {
      validMoves.push({ row: lastMove.from.row + 1, col: lastMove.from.col });
    } else {
      validMoves.push({ row: lastMove.from.row - 1, col: lastMove.from.col });
    }
  }
  return validMoves;
}
