//The Rules
// You can only castle if you meet these strict conditions:
// No prior moves: Neither the king nor the specific rook has moved yet in the game.
// Clear path: All squares between the king and the rook must be empty.
// Not in check: Your king cannot currently be under attack.
// No passing through check: The king cannot move through or land on any square attacked by an enemy piece.

import { isKingInCheck } from './isKingInCheck.js';
import { updateBoard } from './updateBoard.ts';

export function getCastlingMoves(board, turn) {
  const validCastlingMoves = [];
  const row = turn === 'w' ? 7 : 0;
  if (
    !isKingInCheck(board, turn) &&
    board[row][4]?.type === 'k' &&
    board[row][4]?.hasMoved === false
  ) {
    const kingsideCastle = { row: row, col: 6 };
    const queensideCastle = { row: row, col: 2 };
    // Check kingside
    if (
      board[row][7]?.type === 'r' &&
      board[row][7]?.hasMoved === false &&
      board[row][5] === null &&
      board[row][6] === null
    ) {
      // Simulate passing through those squares for checks
      let currentBoard = structuredClone(board);
      // Step 1
      currentBoard = updateBoard(currentBoard, row, 4, { row: row, col: 5 });
      if (!isKingInCheck(currentBoard, turn)) {
        // Step 2
        currentBoard = updateBoard(currentBoard, row, 5, { row: row, col: 6 });
        if (!isKingInCheck(currentBoard, turn)) {
          validCastlingMoves.push(kingsideCastle);
        }
      }
    }

    // Check queenside
    if (
      board[row][0]?.type === 'r' &&
      board[row][0]?.hasMoved === false &&
      board[row][3] === null &&
      board[row][2] === null &&
      board[row][1] === null
    ) {
      // Simulate passing through those squares for checks
      let currentBoard = structuredClone(board);
      // Step 1
      currentBoard = updateBoard(currentBoard, row, 4, { row: row, col: 3 });
      if (!isKingInCheck(currentBoard, turn)) {
        // Step 2
        currentBoard = updateBoard(currentBoard, row, 3, { row: row, col: 2 });
        if (!isKingInCheck(currentBoard, turn)) {
          validCastlingMoves.push(queensideCastle);
        }
      }
    }
  }
  return validCastlingMoves;
}
