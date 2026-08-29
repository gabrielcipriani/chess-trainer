/**
 * Creates the chess board DOM and adds piece images to it
 * @param {Array} state - The current state of the board
 */
export function createBoard(state) {

    const board = document.querySelector('.board');
    // loop over rows
    for (let row = 0; row < 8; row++) { 
        // loop ov er columns
        for (let col = 0; col < 8; col++) { 
            const newSquare = document.createElement('div');
            // add square class and colour square class
            newSquare.classList.add('square', (row + col) % 2 === 0 ? 'wSquare' : 'bSquare');

            newSquare.dataset.row = row;
            newSquare.dataset.col = col;

            // Add piece
            const piece = state[row][col];
            const pieceElement = document.createElement('img');
            if (piece) {
                pieceElement.src = `src/assets/${piece.type + piece.color}.svg`;
                newSquare.appendChild(pieceElement);
            }
            board.appendChild(newSquare);
        }
    }
}

