import { useState, useRef } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';
import { getValidMoves } from './getValidMoves.ts';
import { movePiece } from './moveHandler.ts';
import { checkStatus } from './checkStatus.ts';

import type { Position, Color, LastMove, GameStatus } from './types.ts';
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
  const [board, setBoard] = useState(boardState);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [turn, setTurn] = useState<Color>('w');
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [status, setStatus] = useState<GameStatus>('playing');
  const justGrabbedRef = useRef<Position | null>(null);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

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
    // ignore click if already grabbed same piece
    if (
      justGrabbedRef.current &&
      justGrabbedRef.current.row === row &&
      justGrabbedRef.current.col === col
    ) {
      justGrabbedRef.current = null;
      return;
    }

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
        // attempt to move piece
        const moveResult = movePiece(
          board,
          selectedSquare.row,
          selectedSquare.col,
          row,
          col,
          lastMove,
        );

        setBoard(moveResult.newBoard);
        setLastMove(moveResult.newLastMove);
        setSelectedSquare(null);

        // change turns
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
        setTurn(newTurn);
        setStatus(newStatus);
      } else {
        illegal.play();
        setSelectedSquare(null);
      }
    }
  }

  function handleGrab(row: number, col: number, x: number, y: number): void {
    const piece = board[row][col];
    if (selectedSquare === null) {
      if (!piece || piece.color !== turn) {
        return;
      }
      setSelectedSquare({ row, col });
      justGrabbedRef.current = { row, col };
      setDragPosition({ x, y });
      return;
    }
  }

  function handleDragMove(x: number, y: number): void {
    if (dragPosition === null) return;
    setDragPosition({ x, y });
  }

  function handleDragEnd(x: number, y: number): void {
    setDragPosition(null);
    // find closest square to pointer coordinates
    const targetElement = document
      .elementFromPoint(x, y)
      ?.closest('[data-row]');

    if (!targetElement) {
      setSelectedSquare(null);
      return;
    }

    const targetRow = Number(targetElement.getAttribute('data-row'));
    const targetCol = Number(targetElement.getAttribute('data-col'));

    handleSquareClick(targetRow, targetCol);
  }

  return (
    <>
      <h1>Chess Trainer</h1>
      <div className="game-container">
        <Board
          board={board}
          selectedSquare={selectedSquare}
          validMoves={validMoves}
          onSquareClick={handleSquareClick}
          onPieceGrab={handleGrab}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        />
        {dragPosition && selectedSquare && (
          <img
            src={`/pieces/${board[selectedSquare.row][selectedSquare.col]!.type}${board[selectedSquare.row][selectedSquare.col]!.color}.svg`}
            style={{
              position: 'fixed',
              left: dragPosition.x,
              top: dragPosition.y,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              width: '100px',
              height: '100px',
            }}
          />
        )}
        {status === 'checkmate' && (
          <div className="checkmate-menu">Checkmate!</div>
        )}
        {status === 'stalemate' && (
          <div className="stalemate-menu">Stalemate!</div>
        )}
      </div>
    </>
  );
}
