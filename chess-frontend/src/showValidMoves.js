export function showValidMoves(moves) {
  for (const move of moves) {
    const row = move.row;
    const col = move.col;
    // Find square with this row and col
    const square = document.querySelector(
      `.square[data-row="${row}"][data-col="${col}"]`,
    );
    const marker = document.createElement('div');
    marker.classList.add('valid-move-marker');
    square.appendChild(marker);
  }
}

export function hideValidMoves() {
  const highlightedSquares = document.querySelectorAll('.valid-move-marker');
  if (highlightedSquares) {
    highlightedSquares.forEach((square) => {
      square.remove();
    });
  } else {
    return;
  }
}
