import { checkStatus } from './checkStatus';
import type { Color, MoveResult } from './types';

export function getSan(moveResult: MoveResult, newTurn: Color): string {
  // prefix  +  "x" if capture  +  destination
  let san = '';
  const files = 'abcdefgh';
  let prefix = '';

  if (moveResult.newLastMove.type === 'p') {
    // pawns have no letter but a pawn capture starts with the pawn's file, e.g. exd5
    if (moveResult.isCapture) {
      prefix = files[moveResult.newLastMove.from.col];
    } else {
      prefix = '';
    }
  } else {
    prefix = moveResult.newLastMove.type.toUpperCase();
  }

  // e.g. f3 in Nf3
  const destinationSquare = `${files[moveResult.newLastMove.to.col]}${8 - moveResult.newLastMove.to.row}`;

  if (moveResult.isCastling) {
    // if king moves to col 6 it's kingside
    san = `${moveResult.newLastMove.to.col === 6 ? 'O-O' : 'O-O-O'}`;
  } else {
    san = `${prefix}${moveResult.isCapture ? 'x' : ''}${destinationSquare}`;
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
