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
};

export function getPseudoLegalMoves(board, fromRow, fromCol) {
  const piece = board[fromRow][fromCol];
  const validMoves = [];

  // Sliding pieces (rook, bishop, queen)
  if (piece.type === 'r' || piece.type === 'q' || piece.type === 'b') {
    const directions = DIRECTIONS[PIECE_NAMES[piece.type]];
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
        if (board[toRow][toCol] !== null) {
          if (board[toRow][toCol].color === piece.color) {
            break;
          }
          // Stop at opponent, give square as a valid move (capture)
          else if (board[toRow][toCol].color !== piece.color) {
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
  } else if (piece.type === 'n' || piece.type === 'k') {
    const directions = DIRECTIONS[PIECE_NAMES[piece.type]];
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
      if (board[toRow][toCol] !== null) {
        if (board[toRow][toCol].color === piece.color) {
          continue;
        }
        // Stop at opponent, give square as a valid move (capture)
        else if (board[toRow][toCol].color !== piece.color) {
          validMoves.push({ row: toRow, col: toCol });
          continue;
        }
      } else {
        // Empty square, add to valid moves
        validMoves.push({ row: toRow, col: toCol });
      }
    }
  } else if (piece.type === 'p') {
    const direction = piece.color === 'w' ? -1 : 1;
    const diagonal =
      piece.color === 'w'
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
        if (!piece.hasMoved) {
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
        if (board[toRow][toCol] !== null) {
          if (board[toRow][toCol].color !== piece.color) {
            validMoves.push({ row: toRow, col: toCol });
          }
        }
      }
    }
  }
  return validMoves;
}
