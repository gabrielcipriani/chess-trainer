import { isKingInCheck } from "./isKingInCheck.js";
import { updateBoard } from "./updateBoard.js";
import { getPseudoLegalMoves } from "./getPseudoLegalMoves.js";
import { getCastlingMoves } from "./specialMoves.js";

/**
 * Returns an array of valid moves for a piece at (fromRow, fromCol).
 * A valid move is one that does not leave the player's king in check.
 */
export function getValidMoves(board, fromRow, fromCol, turn, lastMove) {
  const pseudoLegalMoves = getPseudoLegalMoves(board, fromRow, fromCol);
  const validMoves = [];
  for (const move of pseudoLegalMoves) {
    const futureBoard = updateBoard(board, fromRow, fromCol, move)
    if (!isKingInCheck(futureBoard, turn)) {
      validMoves.push(move);
    }
  }
  const currentPiece = board[fromRow][fromCol];
  // Castling check
  if (currentPiece.type === 'k') {
    const castlingMoves = getCastlingMoves(board, turn);
    if (castlingMoves) {
      validMoves.push(...castlingMoves)
    }
  }
  // En passant check
  // If last move was pawn move, and double step,
  // check if opponent pawn piece left or right matching fromRow fromCol,
  // add square behind to valid moves (en passant)

  if (currentPiece.type === 'p' && lastMove?.type === 'p' && Math.abs(lastMove.from.row - lastMove.to.row) === 2 && fromRow === lastMove.to.row && Math.abs(fromCol - lastMove.to.col) === 1) {
    if (turn === 'w') {
      validMoves.push({ row: lastMove.from.row + 1, col: lastMove.from.col });
    }
    else {
      validMoves.push({ row: lastMove.from.row - 1, col: lastMove.from.col });
    }
  }
  return validMoves;
}