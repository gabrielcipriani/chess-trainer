import { movePiece } from './moveHandler.ts';

import type { GameState, GameAction } from './types.ts';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE': {
      const { row: fromRow, col: fromCol } = action.from;
      const { row: toRow, col: toCol } = action.to;

      const moveResult = movePiece(
        state.board,
        fromRow,
        fromCol,
        toRow,
        toCol,
        state.lastMove,
      );

      const newTurn = state.turn === 'w' ? 'b' : 'w';

      const newFullmoveNumber =
        state.turn === 'b' ? state.fullmoveNumber + 1 : state.fullmoveNumber;

      // calculate halfmoves
      // if pawn move or capture set to 0, otherwise +1
      let newHalfmoveClock = state.halfmoveClock;
      if (moveResult.newLastMove.type === 'p' || moveResult.isCapture) {
        newHalfmoveClock = 0;
      } else {
        newHalfmoveClock++;
      }

      return {
        board: moveResult.newBoard,
        turn: newTurn,
        lastMove: moveResult.newLastMove,
        halfmoveClock: newHalfmoveClock,
        fullmoveNumber: newFullmoveNumber,
      };
    }
    //TODO REDO/UNDO/RESET
  }
}
