import type { Board, Position } from "./types.ts";

export const DIRECTIONS = {
  ROOK: [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ],
  BISHOP: [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ],
  QUEEN: [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ],
  KNIGHT: [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  KING: [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ],
};

const PIECE_NAMES = {
  r: 'ROOK',
  b: 'BISHOP',
  q: 'QUEEN',
  n: 'KNIGHT',
  k: 'KING',
} as const;

export function getPseudoLegalMoves(board: Board, fromRow: number, fromCol: number): Position[] {
  const movingPiece = board[fromRow][fromCol];
  if (!movingPiece) {
    return [];
  }
  const validMoves: Position[] = [];

  // Sliding pieces (rook, bishop, queen)
  if (movingPiece.type === 'r' || movingPiece.type === 'q' || movingPiece.type === 'b') {
    const directions = DIRECTIONS[PIECE_NAMES[movingPiece.type]];
    for (const dir of directions) {
      // Start from selected piece
      let toRow = fromRow;
      let toCol = fromCol;
      // Stop if the move would be off the board
      while (toRow < 8 && toCol < 8 && toRow >= 0 && toCol >= 0) {
        toRow += dir[0];
        toCol += dir[1];
        // Out of bounds check
        if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
          break;
        }
        // Stop at own piece, do not give square as a valid move
        const targetPiece = board[toRow][toCol];
        if (targetPiece) {
          if (targetPiece.color === movingPiece.color) {
            break;
          }
          // Stop at opponent, give square as a valid move (capture)
          else if (targetPiece.color !== movingPiece.color) {
            validMoves.push({ row: toRow, col: toCol });
            break;
          }
        }
        // Empty square, add to valid moves
        else {
          validMoves.push({ row: toRow, col: toCol });
        }
      }
    }
  } else if (movingPiece.type === 'n' || movingPiece.type === 'k') {
    const directions = DIRECTIONS[PIECE_NAMES[movingPiece.type]];
    for (const dir of directions) {
      // Start from selected piece
      let toRow = fromRow;
      let toCol = fromCol;
      toRow += dir[0];
      toCol += dir[1];
      // Out of bounds check
      if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
        continue;
      }
      // Stop at own piece, do not give square as a valid move
      const targetPiece = board[toRow][toCol];
      if (targetPiece) {
        if (targetPiece.color === movingPiece.color) {
          continue;
        }
        // Stop at opponent, give square as a valid move (capture)
        else if (targetPiece.color !== movingPiece.color) {
          validMoves.push({ row: toRow, col: toCol });
          continue;
        }
      } else {
        // Empty square, add to valid moves
        validMoves.push({ row: toRow, col: toCol });
      }
    }
  } else if (movingPiece.type === 'p') {
    const direction = movingPiece.color === 'w' ? -1 : 1;
    const diagonal =
      movingPiece.color === 'w'
        ? [
            [-1, -1],
            [-1, 1],
          ]
        : [
            [1, -1],
            [1, 1],
          ];
    const singleStep = fromRow + direction;
    if (singleStep >= 0 && singleStep < 8) {
      // Check first square ahead is empty
      if (board[singleStep][fromCol] === null) {
        validMoves.push({ row: singleStep, col: fromCol });
        // Then check if double step is possible
        if (!movingPiece.hasMoved) {
          const doubleStep = fromRow + direction * 2;
          if (doubleStep >= 0 && doubleStep < 8) {
            if (board[doubleStep][fromCol] === null) {
              validMoves.push({ row: doubleStep, col: fromCol });
            }
          }
        }
      }
    }
    for (const dir of diagonal) {
      let toRow = fromRow + dir[0];
      let toCol = fromCol + dir[1];
      if (toRow >= 0 && toRow < 8 && toCol >= 0 && toCol < 8) {
        // Check if square occupied
        const targetPiece = board[toRow][toCol];
        if (targetPiece) {
          if (targetPiece.color !== movingPiece.color) {
            validMoves.push({ row: toRow, col: toCol });
          }
        }
      }
    }
  }
  return validMoves;
}
