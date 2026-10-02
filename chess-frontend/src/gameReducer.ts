import { movePiece } from './moveHandler.ts';

import type { GameState, GameAction, GameHistory } from './types.ts';

export function gameReducer(
  gameHistory: GameHistory,
  action: GameAction,
): GameHistory {
  switch (action.type) {
    case 'MOVE': {
      const { row: fromRow, col: fromCol } = action.from;
      const { row: toRow, col: toCol } = action.to;

      const currentIndex = gameHistory.currentIndex;
      const state = gameHistory.history[currentIndex];

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
      // if pawn move or capture set to 0, else add 1
      let newHalfmoveClock = state.halfmoveClock;

      if (moveResult.newLastMove.type === 'p' || moveResult.isCapture) {
        newHalfmoveClock = 0;
      } else {
        newHalfmoveClock++;
      }

      // update history
      const newHistory: GameState[] = [
        // throw away future history on new move
        ...gameHistory.history.slice(0, currentIndex + 1),
        {
          board: moveResult.newBoard,
          turn: newTurn,
          lastMove: moveResult.newLastMove,
          halfmoveClock: newHalfmoveClock,
          fullmoveNumber: newFullmoveNumber,
        },
      ];

      return {
        history: newHistory,
        currentIndex: currentIndex + 1,
        direction: 'fwd',
      };
    }

    case 'UNDO': {
      // guard clause for starting position
      if (gameHistory.currentIndex === 0) {
        return gameHistory;
      }
      // shift the index back 1; same history
      return {
        history: gameHistory.history,
        currentIndex: gameHistory.currentIndex - 1,
        direction: 'back',
      };
    }

    case 'REDO': {
      // guard clause for starting position
      if (gameHistory.currentIndex === gameHistory.history.length - 1) {
        return gameHistory;
      }
      // shift the index forwards 1; same history
      return {
        history: gameHistory.history,
        currentIndex: gameHistory.currentIndex + 1,
        direction: 'fwd',
      };
    }
    //TODO: RESET
  }
}
