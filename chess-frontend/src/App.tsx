import { useState } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';
import { getValidMoves } from './getValidMoves.ts';
import { movePiece } from './moveHandler.ts';
import { playerHasLegalMove } from './playerHasLegalMove.ts';
import { isKingInCheck } from './isKingInCheck.ts';

import type { Position, Color, LastMove, GameStatus } from './types.ts';

export function App() {
  const [board, setBoard] = useState(boardState);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [turn, setTurn] = useState<Color>('w');
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [status, setStatus] = useState<GameStatus>('playing');

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
        console.log('valid move!');

        // attempt to move piece
        const moveResult = movePiece(
          board,
          selectedSquare.row,
          selectedSquare.col,
          row,
          col,
          lastMove,
        );

        // promotion check
        if (moveResult.isPromotion) {
        }

        setBoard(moveResult.newBoard);
        setLastMove(moveResult.newLastMove);
        setSelectedSquare(null);

        // attempt to change turns
        const newTurn = turn === 'w' ? 'b' : 'w';
        setTurn(newTurn);

        // Check if checkmate or stalemate
        if (
          !playerHasLegalMove(
            moveResult.newBoard,
            newTurn,
            moveResult.newLastMove,
          )
        ) {
          if (isKingInCheck(moveResult.newBoard, turn)) {
            setStatus('checkmate');
          }
        } else {
          setStatus('stalemate');
        }
      } else {
        setSelectedSquare(null);
      }
    }
  }

  return (
    <>
      <h1>Chess Trainer</h1>
      <Board
        board={board}
        selectedSquare={selectedSquare}
        validMoves={validMoves}
        onSquareClick={handleSquareClick}
      />
      {status === 'checkmate' && (
        <div className="checkmate-menu">Checkmate!</div>
      )}
      {status === 'stalemate' && (
        <div className="stalemate-menu">Stalemate!</div>
      )}
    </>
  );
}
