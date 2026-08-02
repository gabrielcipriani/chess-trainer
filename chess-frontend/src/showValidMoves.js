export function showValidMoves(moves, board) {
  for (const move of moves) {
    const row = move.row;
    const col = move.col;
    // Find square with this row and col
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    square.classList.add('selected');
  }
}