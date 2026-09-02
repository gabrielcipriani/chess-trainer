
/**
 * Creates the chess board DOM and adds piece images to it
 * @param {Array} state - The current state of the board
 */
export function createBoard(state) {
const files = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const board = document.querySelector('.board');
// Loop over rows
for (let row = 0; row < 8; row++) { 
    // Loop over columns
    for (let col = 0; col < 8; col++) { 
        const newSquare = document.createElement('div');
        // Add square class and colour square class
        newSquare.classList.add('square', (row + col) % 2 === 0 ? 'wSquare' : 'bSquare');
        // Add row and col data attributes
        newSquare.dataset.row = row;
        newSquare.dataset.col = col;
        // Add piece to square
        const piece = state[row][col];
        const pieceElement = document.createElement('img');
        if (piece) {
            pieceElement.src = `/pieces/${piece.type + piece.color}.svg`;
            newSquare.appendChild(pieceElement);
        }

        // Add coordinates for first row
        if (row === 7) {
            const coord = document.createElement('div');
            coord.classList.add('coordinate-files');
            coord.textContent = files[col];
            newSquare.appendChild(coord);
        }
        // Add coordinates for first column
        if (col === 0) {
            const coord = document.createElement('div');
            coord.classList.add('coordinate-ranks');
            coord.textContent = 8 - row;
            newSquare.appendChild(coord);
        }

        board.appendChild(newSquare);


    }
}
}

