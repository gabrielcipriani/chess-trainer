import { getValidMoves } from "./getValidMoves.js";

export function playerHasLegalMove(board, turn) {
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, square] of row.entries()) {
      if (square?.color === turn) {
        const validMoves = getValidMoves(board, rowIndex, colIndex, turn);
        
        if (validMoves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
};