import { isMoveLegal } from './moveRules.js';

export function getValidMoves(boardState, fromRow, fromCol) {
  const piece = boardState[fromRow][fromCol];
  const validMoves = [];
  for (let toRow=0; toRow<8; toRow++) {
    for (let toCol=0; toCol<8; toCol++) {
      if (isMoveLegal(boardState, fromRow, fromCol, toRow, toCol)) {
        validMoves.push({ row: toRow, col: toCol});
      }
    }
  }
  return validMoves;
}