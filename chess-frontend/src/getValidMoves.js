import { getPseudoLegalMoves } from "./getPseudoLegalMoves.js";
import { isKingInCheck } from "./isKingInCheck.js";
import { updateBoard } from "./updateBoard.js";

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