import { createBoard } from './createBoard.ts';
import { boardState } from './boardState.ts';
import { getValidMoves } from './getValidMoves.ts';
import { hideValidMoves, showValidMoves } from './showValidMoves.ts';
import {
  showPromotionMenu,
  showCheckmateMenu,
  showStalemateMenu,
} from './menus.ts';
import { updateBoard } from './updateBoard.ts';
import { isKingInCheck } from './isKingInCheck.ts';
import { playerHasLegalMove } from './playerHasLegalMove.ts';
import { animateMove, movePiece } from './moveHandler.ts';

import type { Color, LastMove, Position } from './types.ts';

// Copy of starting board state
let currentBoard = structuredClone(boardState);

// Start board history
const boardHistory = [];
boardHistory.push(currentBoard);

// Build board on DOM
createBoard(currentBoard);

// Get board container for event delegation
const board = document.querySelector<HTMLDivElement>('.board');
if (!board) {
  throw new Error('Board element not found');
}

const heading = document.querySelector<HTMLHeadingElement>('h1');
if (!heading) {
  throw new Error('Heading not found');
}

heading.textContent = "White's turn";
let selectedSquareElement: HTMLDivElement | null = null;
let currentPieceImg: HTMLImageElement | null = null;
let validMoves: Position[] = [];
let lastMove: LastMove | null = null;
let turn: Color = 'w';
let gameOver = false;
let halfmoves = 0;

board.addEventListener('click', async (event) => {
  if (gameOver) {
    return;
  }

  if (!(event.target instanceof Element)) {
    return;
  }

  // Select square that was clicked
  const targetSquareElement = event.target.closest<HTMLDivElement>('.square');

  // Guard clause against invalid clicks
  if (!targetSquareElement) {
    return;
  }

  hideValidMoves();

  const targetRow = Number(targetSquareElement.dataset.row);
  const targetCol = Number(targetSquareElement.dataset.col);
  const piece = currentBoard[targetRow][targetCol];

  // No square currently selected
  if (selectedSquareElement === null) {
    if (!piece) {
      return;
    }

    if (piece.color !== turn) {
      return;
    }

    targetSquareElement.classList.add('selected');
    selectedSquareElement = targetSquareElement;
    currentPieceImg = selectedSquareElement.querySelector('img');
    const fromRow = Number(selectedSquareElement.dataset.row);
    const fromCol = Number(selectedSquareElement.dataset.col);

    // Get all valid moves
    validMoves = getValidMoves(currentBoard, fromRow, fromCol, turn, lastMove);
    showValidMoves(validMoves);
  }

  // There is a square already selected
  else {
    // New selected piece image
    const targetPieceImg = targetSquareElement.querySelector('img');

    // Current square position
    const fromRow = Number(selectedSquareElement.dataset.row);
    const fromCol = Number(selectedSquareElement.dataset.col);

    // Destination square position
    const toRow = Number(targetSquareElement.dataset.row);
    const toCol = Number(targetSquareElement.dataset.col);

    // Reset if same square clicked twice
    if (targetSquareElement === selectedSquareElement) {
      selectedSquareElement.classList.remove('selected');
      selectedSquareElement = null;
      return;
    }

    // Move piece to selected square
    if (validMoves.some((move) => move.row === toRow && move.col === toCol)) {
      const result = movePiece(
        currentBoard,
        fromRow,
        fromCol,
        toRow,
        toCol,
        lastMove,
      );
      currentBoard = result.newBoard;
      lastMove = result.newLastMove;

      // Update DOM
      // Remove highlight
      selectedSquareElement.classList.remove('selected');

      // Remove captured image
      if (targetPieceImg) {
        targetPieceImg.remove();
      }

      if (!currentPieceImg) {
        throw new Error('Selected piece image not found');
      }

      targetSquareElement.appendChild(currentPieceImg);

      // Animate move
      animateMove(currentPieceImg, selectedSquareElement, targetSquareElement);

      if (result.isEnPassant) {
        // Remove the previous pawn (same row as passing pawn)
        const passedPawnImg = document.querySelector(
          `.square[data-row="${fromRow}"][data-col="${toCol}"] img`,
        );
        if (!passedPawnImg) {
          throw new Error('Paseed pawn image not found');
        }
        passedPawnImg.remove();
      }

      if (result.isPromotion) {
        const promotedType = await showPromotionMenu(turn);
        const promotedPiece = currentBoard[toRow][toCol];

        if (!promotedPiece) {
          throw new Error('Promoted piece not found');
        }
        promotedPiece.type = promotedType;

        // Update image
        const promotedPieceImg =
          targetSquareElement.querySelector<HTMLImageElement>('img');

        if (!promotedPieceImg) {
          throw new Error('Promoted image not found');
        }

        promotedPieceImg.src = `/pieces/${promotedType + turn}.svg`;
      }

      if (result.isCastling) {
        // Determine rook row based on turn
        const rookRow = turn === 'w' ? 7 : 0;
        // Kingside castle
        if (toCol === 6) {
          // Update board for rook move
          currentBoard = updateBoard(currentBoard, rookRow, 7, {
            row: rookRow,
            col: 5,
          });

          // Update DOM
          const rookSquareFrom = document.querySelector<HTMLDivElement>(
            `.square[data-row="${rookRow}"][data-col="7"]`,
          );
          const rookSquareTo = document.querySelector(
            `.square[data-row="${rookRow}"][data-col="5"]`,
          );

          if (!rookSquareFrom || !rookSquareTo) {
            throw new Error('Castling rook square not found');
          }

          const rookImg = rookSquareFrom.querySelector('img');

          if (!rookImg) {
            throw new Error('Castling rook image not found');
          }
          
          rookSquareTo.appendChild(rookImg);
        }
        // Queenside castle
        else if (toCol === 2) {
          // Update board for rook move
          currentBoard = updateBoard(currentBoard, rookRow, 0, {
            row: rookRow,
            col: 3,
          });
          // Update DOM
          const rookSquareFrom = document.querySelector(
            `.square[data-row="${rookRow}"][data-col="0"]`,
          );
          const rookSquareTo = document.querySelector(
            `.square[data-row="${rookRow}"][data-col="3"]`,
          );

          if (!rookSquareFrom || !rookSquareTo) {
            throw new Error('Castling rook square not found');
          }

          const rookImg = rookSquareFrom.querySelector('img');

          if (!rookImg) {
            throw new Error('Castling rook image not found');
          }

          rookSquareTo.appendChild(rookImg);
        }
      }

      // Switch turns
      halfmoves += 1;
      if (turn === 'w') {
        turn = 'b';
        heading.textContent = "Black's turn";
      } else {
        turn = 'w';
        heading.textContent = "White's turn";
      }

      // Update board history
      boardHistory.push(currentBoard);

      // Check if checkmate or stalemate
      if (
        !playerHasLegalMove(currentBoard, turn, lastMove) &&
        isKingInCheck(currentBoard, turn)
      ) {
        showCheckmateMenu();
      } else if (
        !playerHasLegalMove(currentBoard, turn, lastMove) &&
        !isKingInCheck(currentBoard, turn)
      ) {
        showStalemateMenu();
      }
      selectedSquareElement = null;
    }

    // Same color piece - switch selection
    else if (currentBoard[toRow][toCol]?.color === turn) {
      selectedSquareElement.classList.remove('selected');
      targetSquareElement.classList.add('selected');
      selectedSquareElement = targetSquareElement;
      currentPieceImg = selectedSquareElement.querySelector('img');

      // Get all valid moves
      validMoves = getValidMoves(currentBoard, toRow, toCol, turn, lastMove);
      showValidMoves(validMoves);
      return;
    }

    // Invalid move
    else {
      selectedSquareElement.classList.remove('selected');
      selectedSquareElement = null;
      return;
    }
  }
});

// let isDragging = false;
// let dragStartX = null;
// let dragStartY = null;
// let draggedPiece = null;
// let startSquare = null;
// let initialLeft = null;
// let initialTop = null;
// let offsetX = null;
// let offsetY = null;

// board.addEventListener('pointerdown', (event) => {
//     draggedPiece = event.target.closest('img');
//     if (!draggedPiece) return;

//     startSquare = event.target.closest('.square');
//     const fromRow = Number(startSquare.dataset.row);
//     const fromCol = Number(startSquare.dataset.col);
//     const pieceColor = currentBoard[fromRow][fromCol].color;

//     if (pieceColor !== turn) {
//       draggedPiece = null;
//       startSquare = null;
//       return;
//     }
//     // Image position relative to viewport
//     const imageRect = draggedPiece.getBoundingClientRect();
//     initialLeft = imageRect.left;
//     initialTop = imageRect.top;
//     // Start dragging piece from click position
//     offsetX = event.clientX - initialLeft;
//     offsetY = event.clientY - initialTop;
// });

// board.addEventListener('pointermove', (event) => {
//   if (draggedPiece) {

//     console.log(event.clientX, event.clientY);
//     // leftShift = event.clientX - leftPos;
//     // topShift = event.clientY - topPos;

//     draggedPiece.style.transform = `translate(${event.clientX - initialLeft - offsetX}px, ${event.clientY - initialTop - offsetY}px)`;
//   }
// });
// board.addEventListener('pointerup', (event) => {
//   // check if square is the same as start square, if so reset
//   const targetSquare = event.target.closest('.square');
//   if (targetSquare === startSquare) {
//     draggedPiece.style.transform = '';
//   }
//   else if (true) {

//   }
//   else {
//   }
//   // if valid square move there, if not valid again reset to start
//   // finish the drag
//   draggedPiece = null;
//   startSquare = null;
// });
