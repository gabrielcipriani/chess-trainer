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

  const originSquare = board[fromRow][fromCol];
  if (!originSquare) {
    throw new Error(`Piece to move not found at (${fromRow}, ${fromCol})`);
  }
    
  const turn = originSquare.color;

  let newBoard = updateBoard(board, fromRow, fromCol, {
    row: toRow,
    col: toCol,
  });

  const newLastMove: LastMove = {
    from: { row: fromRow, col: fromCol },
    to: { row: toRow, col: toCol },
    type: originSquare.type,
  };
  // Check for capture
  const isCapture = board[toRow][toCol] !== null;

  // Castling if king moves two squares either side
  const isCastling =
    originSquare.type === 'k' &&
    fromRow === toRow &&
    Math.abs(fromCol - toCol) === 2;

  // En passant if current pawn moves diagonally into empty square
  const isEnPassant =
    lastMove?.type === 'p' &&
    originSquare.type === 'p' &&
    Math.abs(fromCol - toCol) === 1 &&
    board[toRow][toCol] === null;

  // Pawn promotion if pawn on final rank
  const isPromotion = originSquare.type === 'p' && (toRow === 0 || toRow === 7);

  if (isCastling) {
    // determine rook row based on turn
    const rookRow = turn === 'w' ? 7 : 0;
    // kingside castle
    if (toCol === 6) {
      // update board for rook move
      newBoard = updateBoard(newBoard, rookRow, 7, {
        row: rookRow,
        col: 5,
      });
    }
    // queenside castle
    else if (toCol === 2) {
      // update board for rook move
      newBoard = updateBoard(newBoard, rookRow, 0, {
        row: rookRow,
        col: 3,
      });
    }
  }

  if(isEnPassant) {
    // remove passed pawm
    newBoard[fromRow][toCol] = null;
  }
  
  return { newBoard, newLastMove, isCastling, isEnPassant, isPromotion, isCapture };
}