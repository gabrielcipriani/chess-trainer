import { updateBoard } from './updateBoard.ts';

import type { Board, LastMove } from './types.ts';

export function movePiece(
  board: Board,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
  lastMove: LastMove | null,
) {
  // Check if castling (king moves 2 squares)
  const originSquare = board[fromRow][fromCol];
  if (!originSquare) {
    throw new Error(`Piece to move not found at (${fromRow}, ${fromCol})`);
  }
  const isCastling =
    originSquare.type === 'k' &&
    fromRow === toRow &&
    Math.abs(fromCol - toCol) === 2;

  // Check if en passant (current pawn moves diagonally into empty square)
  const isEnPassant =
    lastMove?.type === 'p' &&
    originSquare.type === 'p' &&
    Math.abs(fromCol - toCol) === 1 &&
    board[toRow][toCol] === null;

  // Check for pawn promotion
  const isPromotion = originSquare.type === 'p' && (toRow === 0 || toRow === 7);

  const newBoard = updateBoard(board, fromRow, fromCol, {
    row: toRow,
    col: toCol,
  });

  const newLastMove: LastMove = {
    from: { row: fromRow, col: fromCol },
    to: { row: toRow, col: toCol },
    type: originSquare.type,
  };

  return { newBoard, newLastMove, isCastling, isEnPassant, isPromotion };
}

export function animateMove(
  pieceImg: HTMLImageElement,
  originElement: Element,
  destinationElement: Element,
) {
  if (!pieceImg) {
    throw new Error(`Moving piece is missing its image`);
  }
  // Measure origin and destination squares
  const originRect = originElement.getBoundingClientRect();
  const destinationRect = destinationElement.getBoundingClientRect();
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
