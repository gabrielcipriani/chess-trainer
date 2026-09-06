import type { Board, Color, PieceType } from "./types.ts";

const DIRECTIONS = {
  FILE: [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ],
  DIAGONAL: [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ],
};

export function findPiece(board: Board, turn: Color, type: PieceType): [number, number] | null {
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, square] of row.entries()) {
      if (square?.type === type && square?.color === turn) {
        return [rowIndex, colIndex];
      }
    }
  }
  return null;
}

export function isKingInCheck(board: Board, turn: Color) {
  const kingPosition = findPiece(board, turn, 'k');
  if (!kingPosition) {
    throw new Error(`King not found for color ${turn}`);
  }
  const [kingRow, kingCol] = kingPosition;
  let inCheck = false;

  // Check for enemy king in surrounding squares
  const allDirections = [...DIRECTIONS.FILE, ...DIRECTIONS.DIAGONAL];
  for (const dir of allDirections) {
    let toRow = kingRow + dir[0];
    let toCol = kingCol + dir[1];
    // Out of bounds check
    if (toRow < 8 && toCol < 8 && toRow >= 0 && toCol >= 0) {
      const piece = board[toRow][toCol];
      if (piece && piece.type === 'k' && piece.color !== turn) {
        return true;
      }
    }
  }

  // Check for pawns ahead in diagonals
  const pawnRow = turn === 'w' ? kingRow - 1 : kingRow + 1;
  if (pawnRow >= 0 && pawnRow < 8) {
    const pawnCols = [kingCol - 1, kingCol + 1].filter(
      (col) => col >= 0 && col <= 7,
    );
    for (const col of pawnCols) {
      const piece = board[pawnRow][col];
      if (piece && piece.type === 'p' && piece.color !== turn) {
        return true;
      }
    }
  }

  // Check if square covered by enemy knight
  let knightSquares = [
    [kingRow - 2, kingCol - 1],
    [kingRow - 1, kingCol - 2],
    [kingRow + 1, kingCol - 2],
    [kingRow + 2, kingCol - 1],
    [kingRow + 2, kingCol + 1],
    [kingRow + 1, kingCol + 2],
    [kingRow - 1, kingCol + 2],
    [kingRow - 2, kingCol + 1],
  ];
  for (const [row, col] of knightSquares) {
    if (row >= 0 && row < 8 && col >= 0 && col < 8) {
      const piece = board[row][col];
      if (piece && piece.type === 'n' && piece.color !== turn) {
        return true;
      }
    }
  }

  // Check files for queen or rooks
  const files = DIRECTIONS.FILE;
  for (const dir of files) {
    // Start from selected piece
    let toRow = kingRow;
    let toCol = kingCol;
    // Stop if the move would be off the board
    while (toRow < 8 && toCol < 8 && toRow >= 0 && toCol >= 0) {
      toRow += dir[0];
      toCol += dir[1];
      // Out of bounds check
      if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
        break;
      }
      // Stop at own piece
      const piece = board[toRow][toCol];
      if (piece) {
        if (piece.color === turn) {
          break;
        }
        // Stop at opponent's piece; in check if occupied by rook or queen
        else if (
          piece.type === 'r' ||
          piece.type === 'q'
        ) {
          return true;
        } else {
          break;
        }
      }
    }
  }

  // Check diagonals for queen or bishops
  const diagonals = DIRECTIONS.DIAGONAL;
  for (const dir of diagonals) {
    // Start from selected piece
    let toRow = kingRow;
    let toCol = kingCol;
    // Stop if the move would be off the board
    while (toRow < 8 && toCol < 8 && toRow >= 0 && toCol >= 0) {
      toRow += dir[0];
      toCol += dir[1];
      // Out of bounds check
      if (toRow < 0 || toRow >= 8 || toCol < 0 || toCol >= 8) {
        break;
      }
      // Stop at own piece
      const piece = board[toRow][toCol];
      if (piece) {
        if (piece.color === turn) {
          break;
        }
        // Stop at opponent's piece; in check if occupied by bishop or queen
        else if (
          piece.type === 'b' ||
          piece.type === 'q'
        ) {
          return true;
        } else {
          break;
        }
      }
    }
  }
  return inCheck;
}
