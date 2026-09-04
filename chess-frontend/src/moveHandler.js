import { updateBoard } from "./updateBoard";

export function movePiece(board, fromRow, fromCol, toRow, toCol, lastMove) {
  // Check if castling (king moves 2 squares)
  const isCastling = board[fromRow][fromCol]?.type === 'k' && (fromRow === toRow && Math.abs(fromCol - toCol) === 2);
  // Check if en passant (current pawn moves diagonally into empty square)
  const isEnPassant = lastMove?.type === 'p' && board[fromRow][fromCol].type === 'p' && Math.abs(fromCol - toCol) === 1 && board[toRow][toCol] === null;
  // Check for pawn promotion
  const isPromotion = board[fromRow][fromCol].type === 'p' && (toRow === 0 || toRow === 7);

  const newBoard = updateBoard(board, fromRow, fromCol, { row: toRow, col: toCol });
  const newLastMove = {
    from: { row: fromRow, col: fromCol },
    to: { row: toRow, col: toCol },
    type: board[fromRow][fromCol].type
  };

  return { newBoard, newLastMove, isCastling, isEnPassant, isPromotion };
}

export function animateMove(pieceImg, originSquare, destinationSquare) {
  // Measure origin and destination squares
  const originRect = originSquare.getBoundingClientRect();
  const destinationRect = destinationSquare.getBoundingClientRect();
  const x = originRect.left - destinationRect.left;
  const y = originRect.top - destinationRect.top;
  // Shift back to starting square
  pieceImg.style.transform = `translate(${x}px, ${y}px)`;
  // Slide to destination
  requestAnimationFrame(() => {
    pieceImg.style.transition = 'transform 0.3s';
    pieceImg.style.transform = 'translate(0, 0)';
  });
}