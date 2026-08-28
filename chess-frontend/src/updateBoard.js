/**
 * Returns a new board with the move applied
*/
export function updateBoard(board, fromRow, fromCol, move) {
  // Make copy
  const newBoard = structuredClone(board);
  // Update with move
  const { row: toRow, col: toCol } = move;
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[toRow][toCol].hasMoved = true;
  newBoard[fromRow][fromCol] = null;
  return newBoard;
}