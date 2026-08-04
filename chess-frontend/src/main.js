import { createBoard } from "./createBoard.js";
import { boardState } from "./boardState.js";
import { isMoveLegal } from "./moveRules.js";
import { getValidMoves } from "./getPseudoLegalMoves.js";
import { hideValidMoves, showValidMoves } from "./showValidMoves.js";

//Build board
createBoard(boardState);

//Get board container for event delegation
const board = document.querySelector('.board');


// Player turns
let turn = 'WHITE';
document.querySelector('h1').textContent = "White's turn to move"
let halfmoves = 0;
let fullmoves = Math.floor(halfmoves/2);

let currentSelect = null;
let currentPiece = null;
let validMoves = [];

board.addEventListener('click', (event) => {
  const newSelect = event.target.closest('.square');
  console.log(newSelect)

  // Guard clause against invalid clicks
  if (newSelect === null) {
    return;
  }

  hideValidMoves(board);
  
  // No square currently selected
  if (currentSelect === null) {
    const newPiece = newSelect.querySelector('img');
    if (newPiece === null) {
      return;
    }
    else if (boardState[newSelect.dataset.row][newSelect.dataset.col].color !== turn) {
      return;
    }
    else {
      newSelect.classList.add('selected');
      currentSelect = newSelect;
      currentPiece = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      validMoves = getPseudoLegalMoves(boardState, fromRow, fromCol);
      console.log(validMoves);
      showValidMoves(validMoves, board);
    }
  }

  // Square already selected
  else {
    const newPiece = newSelect.querySelector('img');
    const toRow = Number(newSelect.dataset.row);
    const toCol = Number(newSelect.dataset.col);

    // Same square clicked twice
    if (newSelect === currentSelect) {
      currentSelect.classList.remove('selected');
      currentSelect = null;
      return;
    }

    // No piece on targeted square
    if (newPiece === null) {
      // Move piece to selected square
      if (validMoves.some(move => move.row === toRow && move.col == toCol)) {
        currentSelect.classList.remove('selected');
        boardState[currentSelect.dataset.row][currentSelect.dataset.col].hasMoved = true;
        boardState[newSelect.dataset.row][newSelect.dataset.col] = boardState[currentSelect.dataset.row][currentSelect.dataset.col];
        boardState[currentSelect.dataset.row][currentSelect.dataset.col] = null;

        // Update image
        newSelect.appendChild(currentPiece);

        currentSelect = null;
        // Switch turn
        halfmoves += 1;
        if (turn === 'WHITE') {
          turn = 'BLACK';
          document.querySelector('h1').textContent = "Black's turn to move"
        }
        else {
          turn = 'WHITE';
          document.querySelector('h1').textContent = "White's turn to move"
        }

      }
      // Invalid move
      else {
        currentSelect.classList.remove('selected');
        currentSelect = null;
        return;
      }
    }
    // Opponent piece - capture if possible
    else if (newPiece !== null && boardState[newSelect.dataset.row][newSelect.dataset.col].color !== boardState[currentSelect.dataset.row][currentSelect.dataset.col].color) {
      if (validMoves.some(move => move.row === toRow && move.col == toCol)) {
        currentSelect.classList.remove('selected');
        boardState[currentSelect.dataset.row][currentSelect.dataset.col].hasMoved = true;
        boardState[newSelect.dataset.row][newSelect.dataset.col] = boardState[currentSelect.dataset.row][currentSelect.dataset.col];
        boardState[currentSelect.dataset.row][currentSelect.dataset.col] = null;

        console.log(boardState)

        // Update images
        newPiece.remove();
        newSelect.appendChild(currentPiece);
        currentSelect = null;
        
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
      fromRowconst  = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      validMoves = getPseudoLegalMoves(boardState, fromRow, fromCol);
      console.log(validMoves);
      showValidMoves(validMoves, board);
      return;
    }
  }
});