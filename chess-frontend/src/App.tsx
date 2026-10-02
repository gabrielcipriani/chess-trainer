import { useState, useReducer, useEffect } from 'react';
import { gameReducer } from './gameReducer.ts';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';
import { getValidMoves } from './getValidMoves.ts';
import { movePiece } from './moveHandler.ts';
import { checkStatus } from './checkStatus.ts';
import { CandidateMovesPanel } from './CandidateMovesPanel.tsx';
import { toCandidateMoves } from './candidateMoves.ts';
import { getFen } from './fen.ts';
import { fetchOpeningStats } from './lichessApi.ts';

import type { Position, GameState, CandidateMove } from './types.ts';
import {
  moveSelf,
  moveOpponent,
  illegal,
  capture,
  castle,
  gameEnd,
  moveCheck,
  promote,
} from './sounds.ts';

export function App() {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [candidateMoves, setCandidateMoves] = useState<CandidateMove[]>([]);

  const initialGameState: GameState = {
    board: boardState,
    turn: 'w',
    lastMove: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
  };

  const initialGameHistory = {
    history: [initialGameState],
    currentIndex: 0,
  };

  const [gameHistory, dispatch] = useReducer(gameReducer, initialGameHistory);
  // get latest state from history
  const gameState = gameHistory.history[gameHistory.currentIndex];
  const { board, turn, lastMove } = gameState;
  const status = checkStatus(board, turn, lastMove);

  const fen = getFen(gameState);

  // fetch new candidate moves when board/fen changes
  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      const response = await fetchOpeningStats(fen);
      const candidateMoves = toCandidateMoves(response);
      if (!ignore) {
        setCandidateMoves(candidateMoves);
      }
    }

    loadStats();

    // cleanup
    return () => {
      ignore = true;
    };
  }, [fen]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        dispatch({ type: 'UNDO' });
      }
      else if (event.key === 'ArrowRight') {
        dispatch( {type: 'REDO' });
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    // cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const validMoves = selectedSquare
    ? getValidMoves(
        board,
        selectedSquare.row,
        selectedSquare.col,
        turn,
        lastMove,
      )
    : null;

  function handleSquareClick(row: number, col: number): void {
    // guard clause for promotion menu, checkmate, or stalemate to not allow any moves
    if (status === 'checkmate' || status === 'stalemate') return;

    const piece = board[row][col];

    if (selectedSquare === null) {
      if (!piece || piece.color !== turn) {
        return;
      }
      setSelectedSquare({ row, col });
      return;
    }

    // same square clicked twice: deselect
    if (row === selectedSquare.row && col === selectedSquare.col) {
      setSelectedSquare(null);
    }
    // different piece clicked of same color: switch
    else if (piece && piece.color === turn) {
      setSelectedSquare({ row, col });
    }
    // legal square clicked: move there; if not: deselect
    else {
      if (
        (validMoves ?? []).some((move) => move.row === row && move.col === col)
      ) {
        dispatch({ type: 'MOVE', from: selectedSquare, to: { row, col } });

        const moveResult = movePiece(
          board,
          selectedSquare.row,
          selectedSquare.col,
          row,
          col,
          lastMove,
        );

        const newTurn = turn === 'w' ? 'b' : 'w';

        const newStatus = checkStatus(
          moveResult.newBoard,
          newTurn,
          moveResult.newLastMove,
        );

        // sound effect
        if (newStatus === 'checkmate' || newStatus === 'stalemate') {
          gameEnd.play();
        } else if (newStatus === 'check') {
          moveCheck.play();
        } else if (moveResult.isCastling) {
          castle.play();
        } else if (moveResult.isCapture) {
          capture.play();
        } else if (moveResult.isPromotion) {
          promote.play();
        } else {
          if (turn === 'w') {
            moveSelf.play();
          } else {
            moveOpponent.play();
          }
        }
      } else {
        illegal.play();
      }
      setSelectedSquare(null);
    }
  }

  return (
    <>
      {/* <h1>Chess Trainer</h1> */}
      <div className="main">
        <div className="game-container">
          <Board
            board={board}
            selectedSquare={selectedSquare}
            lastMove={lastMove}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
          />
          {status === 'checkmate' && (
            <div className="checkmate-menu">Checkmate!</div>
          )}
          {status === 'stalemate' && (
            <div className="stalemate-menu">Stalemate!</div>
          )}
        </div>
        <div className="panel">
          <CandidateMovesPanel moves={candidateMoves} />
        </div>
      </div>
    </>
  );
}
