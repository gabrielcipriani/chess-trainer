import { isKingInCheck } from "./isKingInCheck.js";
import { updateBoard } from "./updateBoard.js";
import { getPseudoLegalMoves } from "./getPseudoLegalMoves.js";

/**
 * Returns an array of valid moves for a piece at (fromRow, fromCol).
 * A valid move is one that does not leave the player's king in check.
 */
export function getValidMoves(boardState, fromRow, fromCol, turn) {
  const pseudoLegalMoves = getPseudoLegalMoves(boardState, fromRow, fromCol);
  const validMoves = [];
  for (const move of pseudoLegalMoves) {
    const futureBoard = updateBoard(boardState, fromRow, fromCol, move)
    if (!isKingInCheck(futureBoard, turn)) {
      validMoves.push(move);
    }
  }
  return validMoves;
}