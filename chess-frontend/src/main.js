import { createBoard } from "./createBoard.js"; 
import { boardState } from "./boardState.js";
import { getValidMoves } from "./getValidMoves.js";
import { hideValidMoves, showValidMoves } from "./showValidMoves.js";
import { showPromotionMenu } from "./menus.js";
import { showCheckmateMenu } from "./menus.js";
import { updateBoard } from "./updateBoard.js";

// Copy of starting board state
let currentBoard = structuredClone(boardState);

// Start board history
const boardHistory = [];
boardHistory.push(currentBoard);

// Build board on DOM
createBoard(currentBoard);

//Get board container for event delegation
const board = document.querySelector('.board');

// Player turns
let turn = 'w';
document.querySelector('h1').textContent = "White's turn to move"
let halfmoves = 0;
let currentSelect = null;
let currentPiece = null;
let validMoves = [];

board.addEventListener('click', async (event) => {
  const newSelect = event.target.closest('.square');
  console.log(newSelect)

  // Guard clause against invalid clicks
  if (newSelect === null) {
    return;
  }

  hideValidMoves(board);
  
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
      currentPiece = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      validMoves = getValidMoves(currentBoard, fromRow, fromCol, turn);
      if (validMoves.length === 0) {
        showCheckmateMenu();
      }
      else {
        showValidMoves(validMoves, board);
      }
    }
  }

  // There is a square already selected
  else {
    // New selected piece
    const newPiece = newSelect.querySelector('img');
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
    if (newPiece === null) {
      // Move piece to selected square
      if (validMoves.some(move => move.row === toRow && move.col == toCol)) {
        // Remove highlight
        currentSelect.classList.remove('selected');
        // Update board state
        currentBoard = updateBoard(currentBoard, Number(currentSelect.dataset.row), Number(currentSelect.dataset.col), { row: toRow, col: toCol });
        // Update DOM
        currentSelect = null;
        currentPiece.remove();
        newSelect.appendChild(currentPiece);

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
          document.querySelector('h1').textContent = "Black's turn to move"
        }
        else {
          turn = 'w';
          document.querySelector('h1').textContent = "White's turn to move"
        }

        // Update board history
        boardHistory.push(currentBoard);
      }
      // Invalid move
      else {
        currentSelect.classList.remove('selected');
        currentSelect = null;
        return;
      }
    }
    // Opponent piece - capture if possible
    else if (newPiece !== null && currentBoard[newSelect.dataset.row][newSelect.dataset.col].color !== currentBoard[currentSelect.dataset.row][currentSelect.dataset.col].color) {
      if (validMoves.some(move => move.row === toRow && move.col == toCol)) {
        currentSelect.classList.remove('selected');
        currentBoard[currentSelect.dataset.row][currentSelect.dataset.col].hasMoved = true;
        currentBoard[newSelect.dataset.row][newSelect.dataset.col] = currentBoard[currentSelect.dataset.row][currentSelect.dataset.col];
        currentBoard[currentSelect.dataset.row][currentSelect.dataset.col] = null;

        newPiece.remove();
        currentSelect = null;
        newSelect.appendChild(currentPiece);

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
      currentPiece = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      validMoves = getValidMoves(currentBoard, fromRow, fromCol, turn);
      console.log(validMoves);
      showValidMoves(validMoves, board);
      return;
    }
  }
});