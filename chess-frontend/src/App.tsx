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
import { MoveTimeline } from './MoveTimeline.tsx';
import { getPath, findNode, addMove, removeMove } from './repertoire.ts';
import { toUci, fromUci } from './uci.ts';
import { fetchRepertoireTree, saveRepertoireTree } from './repertoireApi.ts';

import {
  type Position,
  type GameState,
  type CandidateMove,
  type GameHistory,
  type RepertoireNode,
  type SaveStatus,
} from './types.ts';
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

const initialGameState: GameState = {
  board: boardState,
  turn: 'w',
  lastMove: null,
  san: null,
  halfmoveClock: 0,
  fullmoveNumber: 1,
};

const initialGameHistory: GameHistory = {
  history: [initialGameState],
  currentIndex: 0,
  direction: 'fwd',
};

// fixed repertoire id for now
const REPERTOIRE_ID = 1;

const saveStatusMessages: Record<SaveStatus, string> = {
  idle: 'Save your changes',
  saving: 'Saving repertoire...',
  saved: 'Repertoire saved',
  failed: 'Failed to save. Try again',
};

export function App() {
  const [loadFailed, setLoadFailed] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [stats, setStats] = useState<{
    fen: string;
    moves: CandidateMove[];
  } | null>(null);
  const [draft, setDraft] = useState<RepertoireNode | null>(null);
  const [gameHistory, dispatch] = useReducer(gameReducer, initialGameHistory);

  // get latest state from history
  const gameState = gameHistory.history[gameHistory.currentIndex];
  const { board, turn, lastMove } = gameState;
  const status = checkStatus(board, turn, lastMove);

  const path = getPath(gameHistory);
  const currentNode = draft ? findNode(draft, path) : null;

  // draft moves at this position
  const draftMoves =
    currentNode?.children
      .map((child) => child.move)
      .filter((move) => move !== null) ?? [];

  const animatedMove =
    gameHistory.direction === 'fwd'
      ? lastMove
      : gameHistory.history[gameHistory.currentIndex + 1].lastMove;
  let slide = null;
  if (animatedMove) {
    slide =
      gameHistory.direction === 'fwd'
        ? { from: animatedMove.from, to: animatedMove.to }
        : {
            from: animatedMove.to,
            to: animatedMove.from,
          };
  }

  const fen = getFen(gameState);

  // fetch new candidate moves when board/fen changes
  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      const response = await fetchOpeningStats(fen);
      const candidateMoves = toCandidateMoves(response);
      if (!ignore) {
        setStats({ fen, moves: candidateMoves });
      }
    }

    loadStats();

    // cleanup
    return () => {
      ignore = true;
    };
  }, [fen]);

  // hide candidate moves while fetching next move
  const visibleMoves = stats?.fen === fen ? stats.moves : [];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') {
        dispatch({ type: 'UNDO' });
      } else if (event.key === 'ArrowRight') {
        dispatch({ type: 'REDO' });
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    // cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // fetch saved repertoire on start and put in draft
  useEffect(() => {
    fetchRepertoireTree(REPERTOIRE_ID)
      .then(setDraft)
      .catch(() => {
        setLoadFailed(true);
        setDraft({ move: null, children: [] });
      });
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

  function playMove(from: Position, to: Position): void {
    if (!draft) return;

    dispatch({ type: 'MOVE', from, to });

    // preview move to calculate correct sound
    const moveResult = movePiece(
      board,
      from.row,
      from.col,
      to.row,
      to.col,
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

    const uci = toUci(moveResult.newLastMove);
    const newDraft = addMove(draft, path, uci);
    setDraft(newDraft);
    setSaveStatus('idle');
  }

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
        playMove(
          { row: selectedSquare.row, col: selectedSquare.col },
          { row, col },
        );
      } else {
        illegal.play();
      }
      setSelectedSquare(null);
    }
  }

  function handleCandidateClick(uci: string) {
    const { from, to } = fromUci(uci);
    playMove(from, to);
  }

  function handleTrashClick(uci: string) {
    if (!draft) return;

    const newDraft = removeMove(draft, path, uci);
    setDraft(newDraft);
    setSaveStatus('idle');
  }

  async function handleSave() {
    if (!draft) return;

    setSaveStatus('saving');
    try {
      await saveRepertoireTree(REPERTOIRE_ID, draft);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('failed');
    }
  }

  return (
    <>
      <div className="main">
        <div className="game-container">
          <Board
            board={board}
            selectedSquare={selectedSquare}
            slide={slide}
            validMoves={validMoves}
            onSquareClick={handleSquareClick}
          />
          {status === 'checkmate' && (
            <div className="game-over-menu">Checkmate!</div>
          )}
          {status === 'stalemate' && (
            <div className="game-over-menu">Stalemate!</div>
          )}
        </div>
        <div className="side-panel">
          <button
            onClick={handleSave}
            disabled={!draft || saveStatus === 'saving' || loadFailed}
          >
            SAVE
          </button>
          <p role="status">
            {loadFailed
              ? 'Backend unreachable, saving disabled'
              : saveStatusMessages[saveStatus]}
          </p>
          <MoveTimeline positions={gameHistory.history} />
          <CandidateMovesPanel
            moves={visibleMoves}
            draftMoves={draftMoves}
            onMoveClick={handleCandidateClick}
            onTrashClick={handleTrashClick}
          />
        </div>
      </div>
    </>
  );
}
