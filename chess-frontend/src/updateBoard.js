export function updateBoard(board, fromRow, fromCol, move) {
  // Make copy
  const newBoard = board.map(row => [...row]);
  const { row: toRow, col: toCol } = move;
  newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
  newBoard[fromRow][fromCol] = null;
  return newBoard;
}