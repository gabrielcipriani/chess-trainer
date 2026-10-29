import { checkStatus } from './checkStatus';
import { findAllPiece } from './findPieces';
import { getValidMoves } from './getValidMoves';
import type { Board, Color, LastMove, MoveResult } from './types';

export function getSan(
  board: Board,
  moveResult: MoveResult,
  newTurn: Color,
  lastMove: LastMove | null,
): string {
  // prefix + disambiguation + "x" if capture + destination
  let san = '';
  const files = 'abcdefgh';
  let prefix = '';
  let disambiguation = '';
  // e.g. f3 in Nf3
  const destinationSquare =
    files[moveResult.newLastMove.to.col] +
    `${8 - moveResult.newLastMove.to.row}`;

  // prefix is the piece letter
  // pawns have no letter but a pawn capture starts with the pawn's file, e.g. exd5
  if (moveResult.newLastMove.type === 'p') {
    if (moveResult.isCapture) {
      prefix = files[moveResult.newLastMove.from.col];
    } else {
      prefix = '';
    }
  } else {
    prefix = moveResult.newLastMove.type.toUpperCase();
  }

  // disambiguation
  // find other pieces of same type that could have legally reached the square
  const pieceType = moveResult.newLastMove.type;
  if (pieceType !== 'k' && pieceType !== 'p') {
    const turn = newTurn === 'w' ? 'b' : 'w';
    // contains the locations of all pieces of the type
    const foundPieces = findAllPiece(board, turn, pieceType);
    // remove the current piece square
    const others = foundPieces.filter(
      (p) =>
        p.row !== moveResult.newLastMove.from.row ||
        p.col !== moveResult.newLastMove.from.col,
    );
    // check their valid moves
    const legalOthers = others.filter((p) =>
      getValidMoves(board, p.row, p.col, turn, lastMove).some(
        (m) =>
          m.row === moveResult.newLastMove.to.row &&
          m.col === moveResult.newLastMove.to.col,
      ),
    );
    // if none on the same file, add file
    // if none on the same rank, add rank
    // otherwise add both
    if (legalOthers.length > 0) {
      const sameFile = legalOthers.filter(
        (p) => p.col === moveResult.newLastMove.from.col,
      );
      const sameRank = legalOthers.filter(
        (p) => p.row === moveResult.newLastMove.from.row,
      );

      if (sameFile.length === 0) {
        disambiguation = files[moveResult.newLastMove.from.col];
      } else if (sameRank.length === 0) {
        disambiguation = `${8 - moveResult.newLastMove.from.row}`;
      } else {
        disambiguation =
          files[moveResult.newLastMove.from.col] +
          `${8 - moveResult.newLastMove.from.row}`;
      }
    }
  }

  if (moveResult.isCastling) {
    // if king moves to col 6 it's kingside
    san = `${moveResult.newLastMove.to.col === 6 ? 'O-O' : 'O-O-O'}`;
  } else {
    // normal move
    san = `${prefix}${disambiguation}${moveResult.isCapture ? 'x' : ''}${destinationSquare}`;
  }

  // auto queen promotion
  if (moveResult.isPromotion) {
    san += '=Q';
  }

  const status = checkStatus(
    moveResult.newBoard,
    newTurn,
    moveResult.newLastMove,
  );
  if (status === 'check') {
    san += '+';
  } else if (status === 'checkmate') {
    san += '#';
  }
  return san;
}
