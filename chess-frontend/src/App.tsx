import { useState } from 'react';
import { Board } from './Board.tsx';
import { boardState } from './boardState.ts';
import type { Position, Color, LastMove } from './types.ts';
import { getValidMoves } from './getValidMoves.ts';
import { movePiece } from './moveHandler.ts';

export function App() {
  const [board, setBoard] = useState(boardState);
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [turn, setTurn] = useState<Color>('w');
  const [lastMove, setLastMove] = useState<LastMove | null>(null);

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
        setBoard(moveResult.newBoard);
        setLastMove(moveResult.newLastMove);
        setSelectedSquare(null);

        // castling check
        if (moveResult.isCastling) {
        }

        // en passant check
        if (moveResult.isEnPassant) {
        }

        // promotion check
        if (moveResult.isPromotion) {
        }

        // attempt to change turns
        const newTurn = turn === 'w' ? 'b' : 'w';
        setTurn(newTurn);
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
    </>
  );
}
