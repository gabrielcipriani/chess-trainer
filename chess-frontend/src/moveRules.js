export function isMoveLegal(boardState, fromRow, fromCol, toRow, toCol) {
    const piece = boardState[fromRow][fromCol];

    switch(piece.type) {
        case 'p':
            return pawnRules(piece, fromRow, fromCol, toRow, toCol);
        case 'b':
            return bishopRules(fromRow, fromCol, toRow, toCol);
        case 'n':
            return knightRules(fromRow, fromCol, toRow, toCol);
        case 'r':
            return rookRules(fromRow, fromCol, toRow, toCol);
        case 'q':
            return queenRules(fromRow, fromCol, toRow, toCol);
        case 'k':
            return kingRules(fromRow, fromCol, toRow, toCol);
        
    }
    return false;
}

function pawnRules(piece, fromRow, fromCol, toRow, toCol) {
    if (piece.color === 'w') {
        if (fromCol - toCol === 0 && fromRow - toRow > 0 && fromRow - toRow <= 1) {
            return true;
        }
        else if (fromCol - toCol === 0 && fromRow - toRow == 2 && piece.hasMoved === false) {
            return true;
        }
    }
    else if (piece.color === 'b') {
        if (fromCol - toCol === 0 && fromRow - toRow < 0 && fromRow - toRow >= -1) {
            return true;
        }
        else if (fromCol - toCol === 0 && fromRow - toRow === -2 && piece.hasMoved === false) {
            return true;
        }
    }
    else {
        return false;
    }
}

function bishopRules(fromRow, fromCol, toRow, toCol) {
    if (Math.abs((fromRow - toRow)) === Math.abs((fromCol - toCol))) {
        return true;
    }
    else {
        return false;
    }
}

function knightRules(fromRow, fromCol, toRow, toCol) {
    if ((Math.abs(fromRow-toRow) === 2 && Math.abs(fromCol-toCol) === 1) || (Math.abs(fromRow-toRow) === 1 && Math.abs(fromCol-toCol) === 2)) {
        return true;
    }
    else {
        return false;
    }
}

function rookRules(fromRow, fromCol, toRow, toCol) {
    if ((Math.abs(fromRow-toRow) > 0 && Math.abs(fromCol-toCol) === 0) || (Math.abs(fromRow-toRow) === 0 && Math.abs(fromCol-toCol) >0 )) {
        return true;
    }
    else {
        return false;
    }
}

function queenRules(fromRow, fromCol, toRow, toCol) {
    if ((Math.abs(fromRow-toRow) > 0 && Math.abs(fromCol-toCol) === 0) || (Math.abs(fromRow-toRow) === 0 && Math.abs(fromCol-toCol) >0 )) {
        return true;
    }
    else if (Math.abs((fromRow - toRow)) === Math.abs((fromCol - toCol))) {
        return true;
    }
    else {
        return false;
    }
}

function kingRules(fromRow, fromCol, toRow, toCol) {
    if ((Math.abs(fromRow-toRow) === 1 && Math.abs(fromCol-toCol) === 0) || (Math.abs(fromRow-toRow) === 0 && Math.abs(fromCol-toCol) === 1) || (Math.abs(fromRow-toRow) === 1 && Math.abs(fromCol-toCol) === 1)) {
        return true;
    }
    else {
        return false;
    }
}