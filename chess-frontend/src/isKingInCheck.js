const DIRECTIONS = {
  FILE: [[-1,0], [0,1], [1,0], [0,-1]],
  DIAGONAL: [[-1,-1], [-1,1], [1,1], [1,-1]]
};

export function findPiece(boardState, turn, type) {
  for (const [rowIndex, rowObject] of boardState.entries()) {
    for (const [colIndex, colObject] of row.entries()) {
      if (colObject.type === type && colObject.color === turn) {
        return [rowIndex, colIndex];
      }
    }
  }
  return null;
};

export function isKingInCheck(boardState, turn) {
  const [kingRow, kingCol] = findPiece(boardState, turn, 'k');
  let inCheck = false;
  while (inCheck === false) {
    // Check for pawns ahead in diagonals
    const pawnRow = turn === 'w' ? kingRow - 1 : kingRow + 1;
    if (pawnRow >= 0 && pawnRow < 8) {
      const pawnCols = [kingCol - 1, kingCol + 1].filter(col => {
        col >= 0 && col <= 7
      });
    }
    // Check files for queen or rooks
    const directions = DIRECTIONS.FILE;
    for (const dir of directions) {
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
        if (boardState[toRow][toCol] !== null) {
          if (boardState[toRow][toCol].color === turn) {
            break;
          }
          // Stop at opponent's piece; in check if occupied by rook or queen
          else if (boardState[toRow][toCol].color !== turn && (boardState[toRow][toCol].type === 'r' || boardState[toRow][toCol].type === 'q')) {
            inCheck = true;
            break;
          }
        }
      }
    } 
    // Check diagonals for queen or bishops
    const directions = DIRECTIONS.DIAGONAL;
    for (const dir of directions) {
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
        if (boardState[toRow][toCol] !== null) {
          if (boardState[toRow][toCol].color === turn) {
            break;
          }
          // Stop at opponent's piece; in check if occupied by bishop or queen
          else if (boardState[toRow][toCol].color !== turn && (boardState[toRow][toCol].type === 'b' || boardState[toRow][toCol].type === 'q')) {
            inCheck = true;
            break;
          }
        }
      }
    } 
  }
  return inCheck;
}