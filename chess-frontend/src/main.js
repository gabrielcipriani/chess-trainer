import { createBoard } from "./createBoard.js"; 
import { boardState } from "./boardState.js";
import { getValidMoves } from "./getValidMoves.js";
import { hideValidMoves, showValidMoves } from "./showValidMoves.js";
import { showPromotionMenu } from "./menus.js";
import { showCheckmateMenu } from "./menus.js";
import { showStalemateMenu } from "./menus.js";
import { updateBoard } from "./updateBoard.js";
import { isKingInCheck } from "./isKingInCheck.js";
import { playerHasLegalMove } from "./playerHasLegalMove.js";
import { animateMove, movePiece } from "./moveHandler.js";

// Copy of starting board state
let currentBoard = structuredClone(boardState);

// Start board history
const boardHistory = [];
boardHistory.push(currentBoard);

// Build board on DOM
createBoard(currentBoard);

// Get board container for event delegation
const board = document.querySelector('.board');

// Player turns
let turn = 'w';
document.querySelector('h1').textContent = "White's turn"
let halfmoves = 0;
let currentSelect = null;
let currentPieceImg = null;
let validMoves = [];
let gameOver = false;
let lastMove = null;

board.addEventListener('click', async (event) => {
  if (gameOver) {
    return;
  }
  const newSelect = event.target.closest('.square');
  console.log(newSelect)

  // Guard clause against invalid clicks
  if (newSelect === null) {
    return;
  }

  hideValidMoves();
  
  // No square currently selected: select initial square
  if (currentSelect === null) {
    if (newSelect.querySelector('img') === null) {
      return;
    }
    else if (currentBoard[newSelect.dataset.row][newSelect.dataset.col].color !== turn) {
      return;
    }
    else {
      newSelect.classList.add('selected');
      currentSelect = newSelect;
      currentPieceImg = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      validMoves = getValidMoves(currentBoard, fromRow, fromCol, turn, lastMove);
      showValidMoves(validMoves);
    }
  }

  // There is a square already selected
  else {
    // New selected piece
    const newPieceImg = newSelect.querySelector('img');
    // Current square position
    const fromRow = Number(currentSelect.dataset.row);
    const fromCol = Number(currentSelect.dataset.col);
    // Destination square position
    const toRow = Number(newSelect.dataset.row);
    const toCol = Number(newSelect.dataset.col);

    // Reset if same square clicked twice
    if (newSelect === currentSelect) {
      currentSelect.classList.remove('selected');
      currentSelect = null;
      return;
    }

    // Move piece to selected square
    if (validMoves.some(move => move.row === toRow && move.col == toCol)) {

      const result = movePiece(currentBoard, fromRow, fromCol, toRow, toCol, lastMove);
      currentBoard = result.newBoard;
      lastMove = result.newLastMove;

      // Update DOM
      // Remove highlight
      currentSelect.classList.remove('selected');
      // Remove captured image
      if (newPieceImg) {
        newPieceImg.remove();
      }
      newSelect.appendChild(currentPieceImg);

      // Animate move
      animateMove(currentPieceImg, currentSelect, newSelect);

      if (result.isEnPassant) {
        console.log('En passant move detected');
        // Remove the previous pawn (same row as passing pawn)
        const passedPawnImg = document.querySelector(`.square[data-row="${fromRow}"][data-col="${toCol}"] img`); 
        passedPawnImg.remove();
      }

      if (result.isPromotion) {
        const promotedPiece = await showPromotionMenu(turn);
        currentBoard[toRow][toCol].type = promotedPiece;
        newSelect.querySelector('img').src = `/pieces/${promotedPiece + turn}.svg`;
      }


      if (result.isCastling) {
        // Determine rook row based on turn
        const rookRow = turn === 'w' ? 7 : 0;
        // Kingside castle
        if (toCol === 6) {
          // Update board for rook move
          currentBoard = updateBoard(currentBoard, rookRow, 7, { row: rookRow, col: 5 });
          // Update DOM
          const rookSquareFrom = document.querySelector(`.square[data-row="${rookRow}"][data-col="7"]`);
          const rookImg = rookSquareFrom.querySelector('img');
          const rookSquareTo = document.querySelector(`.square[data-row="${rookRow}"][data-col="5"]`);
          rookSquareTo.appendChild(rookImg);

        }
        // Queenside castle
        else if (toCol === 2) { 
          // Update board for rook move
          currentBoard = updateBoard(currentBoard, rookRow, 0, { row: rookRow, col: 3 });
          // Update DOM
          const rookSquareFrom = document.querySelector(`.square[data-row="${rookRow}"][data-col="0"]`);
          const rookImg = rookSquareFrom.querySelector('img');
          const rookSquareTo = document.querySelector(`.square[data-row="${rookRow}"][data-col="3"]`);
          rookSquareTo.appendChild(rookImg);
        }
      }

      // Switch turns
      halfmoves += 1;
      if (turn === 'w') {
        turn = 'b';
        document.querySelector('h1').textContent = "Black's turn"
      }
      else {
        turn = 'w';
        document.querySelector('h1').textContent = "White's turn"
      }
    
      // Update board history
      boardHistory.push(currentBoard);

      // Check if checkmate or stalemate
      if (!playerHasLegalMove(currentBoard, turn) && isKingInCheck(currentBoard, turn)) {
        showCheckmateMenu();
      }
      else if (!playerHasLegalMove(currentBoard, turn) && !isKingInCheck(currentBoard, turn)) {
        showStalemateMenu();
      }
      currentSelect = null;
    }

    // Same color piece - switch selection
    else if (currentBoard[toRow][toCol]?.color === turn) {
      currentSelect.classList.remove('selected');
      newSelect.classList.add('selected');
      currentSelect = newSelect;
      currentPieceImg = currentSelect.querySelector('img');

      // Get all valid moves
      validMoves = getValidMoves(currentBoard, toRow, toCol, turn, lastMove);
      showValidMoves(validMoves);
      return;
    }

    // Invalid move
    else {
      currentSelect.classList.remove('selected');
      currentSelect = null;
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