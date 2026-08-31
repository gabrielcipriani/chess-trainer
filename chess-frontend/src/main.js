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
document.querySelector('h1').textContent = "White's turn to move"
let halfmoves = 0;
let currentSelect = null;
let currentPieceImg = null;
let validMoves = [];
let gameOver = false;

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
      validMoves = getValidMoves(currentBoard, fromRow, fromCol, turn);
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

    // No piece on targeted square
    if (newPieceImg === null) {
      // Move piece to selected square
      if (validMoves.some(move => move.row === toRow && move.col == toCol)) {
        // Remove highlight
        currentSelect.classList.remove('selected');

        // Measure origin and destination squares
        const originRect = currentSelect.getBoundingClientRect();
        const destinationRect = newSelect.getBoundingClientRect();

        // Check if castling (king moves 2 squares)
        const isCastling = currentBoard[fromRow][fromCol]?.type === 'k' && (fromRow === toRow && Math.abs(fromCol - toCol) === 2);
        
        //TODO How will updateBoard work when two moves are made during castling or during pawn promotion?
        // Update board state
        currentBoard = updateBoard(currentBoard, fromRow, fromCol, { row: toRow, col: toCol });

        // Update DOM
        currentSelect = null;
        newSelect.appendChild(currentPieceImg);

        // Animate move
        const x = originRect.left - destinationRect.left;
        const y = originRect.top - destinationRect.top;
        currentPieceImg.style.transform = `translate(${x}px, ${y}px)`;

        requestAnimationFrame(() => {
          currentPieceImg.style.transition = 'transform 0.3s';
          currentPieceImg.style.transform = 'translate(0, 0)';
        });
        
        // Check for pawn promotion
        if (currentBoard[toRow][toCol].type === 'p' && (toRow === 0 || toRow === 7)) {
          const promotedPiece = await showPromotionMenu(turn);
          currentBoard[toRow][toCol].type = promotedPiece;
          newSelect.querySelector('img').src = `src/assets/${promotedPiece + turn}.svg`;
          }

        // Castling
        if (isCastling) {
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
  
        // Switch turn
        halfmoves += 1;
        if (turn === 'w') {
          turn = 'b';
          document.querySelector('h1').textContent = "Black's turn to move"
        }
        else {
          turn = 'w';
          document.querySelector('h1').textContent = "White's turn to move"
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
      // Invalid move
      else {
        currentSelect.classList.remove('selected');
        currentSelect = null;
        return;
      }
    }

    //TODO Refactor to use fromRow fromCol and toRow toCol
    // Opponent piece - capture if possible
    else if (newPieceImg !== null && currentBoard[newSelect.dataset.row][newSelect.dataset.col].color !== currentBoard[currentSelect.dataset.row][currentSelect.dataset.col].color) {
      if (validMoves.some(move => move.row === toRow && move.col == toCol)) {
        // Remove highlight
        currentSelect.classList.remove('selected');

        // Measure origin and destination squares
        const originRect = currentSelect.getBoundingClientRect();
        const destinationRect = newSelect.getBoundingClientRect();

        // Update board state
        currentBoard = updateBoard(currentBoard, Number(currentSelect.dataset.row), Number(currentSelect.dataset.col), { row: toRow, col: toCol });

        // Update DOM
        newPieceImg.remove();
        newSelect.appendChild(currentPieceImg);

        // Animate move
        const x = originRect.left - destinationRect.left;
        const y = originRect.top - destinationRect.top;
        currentPieceImg.style.transform = `translate(${x}px, ${y}px)`;

        requestAnimationFrame(() => {
          currentPieceImg.style.transition = 'transform 0.3s';
          currentPieceImg.style.transform = 'translate(0, 0)';
        });

        // Check for pawn promotion
        if (currentBoard[newSelect.dataset.row][newSelect.dataset.col].type === 'p' && (toRow === 0 || toRow === 7)) {
          const promotedPiece = await showPromotionMenu(turn);
          currentBoard[newSelect.dataset.row][newSelect.dataset.col].type = promotedPiece;
          newSelect.querySelector('img').src = `src/assets/${promotedPiece + turn}.svg`;
        }
        
        // Switch turn
        halfmoves += 1;
        if (turn === 'w') {
          turn = 'b';
          document.querySelector('h1').textContent = "Black's turn"
        }
        else {
          turn = 'w';
          document.querySelector('h1').textContent = "White's turn"
        }

        // Update board state
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
      // Invalid move
      else {
        currentSelect.classList.remove('selected');
        currentSelect = null;
        return;
      }
    }
    // Same color piece - switch selection
    else {
      currentSelect.classList.remove('selected');
      newSelect.classList.add('selected');
      currentSelect = newSelect;
      currentPieceImg = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      validMoves = getValidMoves(currentBoard, fromRow, fromCol, turn);
      console.log(validMoves);
      showValidMoves(validMoves);
      return;
    }
  }
});