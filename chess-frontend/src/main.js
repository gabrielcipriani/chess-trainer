import { createBoard } from "./createBoard.js";
import { boardState } from "./boardState.js";
import { isMoveLegal } from "./moveRules.js";
import { getValidMoves } from "./getValidMoves.js";
import { showValidMoves } from "./showValidMoves.js";

//Build board
createBoard(boardState);

//Get board container for event delegation
const board = document.querySelector('.board');


// Player turns
let turn = 'w';
document.querySelector('h1').textContent = "White's turn"
let halfmoves = 0;
let fullmoves = Math.floor(halfmoves/2);

let currentSelect = null;

board.addEventListener('click', (event) => {
  const newSelect = event.target.closest('.square');
  console.log(newSelect)

  // Guard clause against invalid clicks
  if (newSelect === null) {
    return;
  }
  

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
      const currentPiece = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      const validMoves = getValidMoves(boardState, fromRow, fromCol);
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

    // No piece already on targeted square
    if (newPiece === null) {
      const currentPiece = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Move piece to selected square
      if (isMoveLegal(boardState, fromRow, fromCol, toRow, toCol)) {
        currentSelect.classList.remove('selected');
        boardState[currentSelect.dataset.row][currentSelect.dataset.col].hasMoved = true;
        boardState[newSelect.dataset.row][newSelect.dataset.col] = boardState[currentSelect.dataset.row][currentSelect.dataset.col];
        boardState[currentSelect.dataset.row][currentSelect.dataset.col] = null;

        // Update image
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
      else if (!isMoveLegal(boardState, fromRow, fromCol, toRow, toCol)) {
        // Invalid move
        return;
      }
    }
    // Capture logic
    else if (newPiece !== null && boardState[newSelect.dataset.row][newSelect.dataset.col].color !== boardState[currentSelect.dataset.row][currentSelect.dataset.col].color) {
      if (isMoveLegal(boardState, fromRow, fromCol, toRow, toCol)) {

        // Check if king to be captured
        if (boardState[newSelect.dataset.row][newSelect.dataset.col].type = 'k') {
          return;
        }
        // Pawn must capture diagonally
        else if (boardState[currentSelect.dataset.row][currentSelect.dataset.col].type = 'p') {
          if (fromCol === toCol) {
            return;
          }
        }
        else {
          currentSelect.classList.remove('selected');
          boardState[newSelect.dataset.row][newSelect.dataset.col] = boardState[currentSelect.dataset.row][currentSelect.dataset.col];
          boardState[currentSelect.dataset.row][currentSelect.dataset.col] = null;
        }

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
      else if (!isMoveLegal(boardState, fromRow, fromCol, toRow, toCol)) {
        // Invalid move
        return;
      }
    }
    else {
      currentSelect.classList.remove('selected');
      newSelect.classList.add('selected');
      currentSelect = newSelect;
      const currentPiece = currentSelect.querySelector('img');
      const fromRow = Number(currentSelect.dataset.row);
      const fromCol = Number(currentSelect.dataset.col);
      // Get all valid moves
      const validMoves = getValidMoves(boardState, fromRow, fromCol);
      console.log(validMoves);
      showValidMoves(validMoves, board);
      return;
    }
  }
});