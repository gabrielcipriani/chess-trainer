import { getValidMoves } from './getValidMoves.ts';

import type { Board, Color, Position, LastMove } from './types.ts';

export function playerHasLegalMove(
  board: Board,
  turn: Color,
  lastMove: LastMove | null,
): boolean {
  for (const [rowIndex, row] of board.entries()) {
    for (const [colIndex, square] of row.entries()) {
      if (square?.color === turn) {
        const validMoves: Position[] = getValidMoves(
          board,
          rowIndex,
          colIndex,
          turn,
          lastMove,
        );

        if (validMoves.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}
