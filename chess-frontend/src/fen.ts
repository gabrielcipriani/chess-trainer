import type { Board, Color, LastMove } from './types.ts';

export function getFen(
  board: Board,
  turn: Color,
  lastMove: LastMove | null,
): string {
  let fen = '';
  let emptyCount = 0;

  for (let row = 0; row < 8; row++) {
    emptyCount = 0;
    if (row > 0) {
      fen += '/';
    }
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === null) {
        emptyCount++;
        if (col === 7) {
          fen += String(emptyCount);
        }
      } else {
        if (emptyCount > 0) {
          fen += String(emptyCount);
          emptyCount = 0;
        }
        if (piece.color === 'w') {
          fen += piece.type.toUpperCase();
        } else {
          fen += piece.type;
        }
      }
    }
  }

  fen += ` ${turn} `;
  // assume standard board layout - rooks in default starting positions
  let whiteCastlingRights = '';
  if (board[7][4]?.type === 'k' && board[7][4]?.hasMoved === false) {
    if (board[7][7]?.type === 'r' && board[7][7]?.hasMoved === false) {
      whiteCastlingRights += 'K';
    }
    if (board[7][0]?.type === 'r' && board[7][0]?.hasMoved === false) {
      whiteCastlingRights += 'Q';
    }
  } else {
    whiteCastlingRights = '-';
  }

  let blackCastlingRights = '';
  if (board[0][4]?.type === 'k' && board[0][4]?.hasMoved === false) {
    if (board[0][7]?.type === 'r' && board[0][7]?.hasMoved === false) {
      blackCastlingRights += 'k';
    }
    if (board[0][0]?.type === 'r' && board[0][0]?.hasMoved === false) {
      blackCastlingRights += 'q';
    }
  } else {
    blackCastlingRights = '-';
  }

  if (whiteCastlingRights + blackCastlingRights === '--') {
    fen += '-';
  } else if (whiteCastlingRights === '-') {
    fen += blackCastlingRights;
  } else if (blackCastlingRights === '-') {
    fen += whiteCastlingRights;
  } else {
    fen += whiteCastlingRights + blackCastlingRights;
  }

  // check for en passant
  if (
    lastMove &&
    lastMove.type === 'p' &&
    Math.abs(lastMove.to.row - lastMove.from.row) === 2 &&
    (board[lastMove.to.row][lastMove.to.col-1]?.type === 'p' || board[lastMove.to.row][lastMove.to.col+1]?.type === 'p')
  ) {
    // get square notation for en passant target square (square behind pawn)
    const file = 'abcdefgh'[lastMove.from.col];
    const rank =
      turn === 'w' ? 8 - lastMove.to.row + 1 : 8 - lastMove.to.row - 1;
    fen += ` ${file}${rank} `;
  } else {
    fen += ` - `;
  }

  const halfMoves = 0;
  const fullMoves = 1;
  fen += `${halfMoves} ${fullMoves}`;
  return fen;
}

// go through every row and every col of board
// get piece type, lowercase Black uppercase White
// add / at the end of row
// if empty space add 1 to counter
// once no longer empty add counter + "/" and reset counter
// add whose turn it is
// add castling rights based on whether king has moved and which rook has moved
// add en passant square (convert to square notation)
// add halfmove clock (moves since last capture/pawn push)
// add fullmove number, increments after Black moves
