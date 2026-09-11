// Hierarchical order of sound effects to play for a move:
// Checkmate / stalemate > check > promotion/castling > capture > normal move

export const moveSelf = new Audio('/sounds/move-self.mp3');
export const moveOpponent = new Audio('/sounds/move-opponent.mp3');
export const illegal = new Audio('/sounds/illegal.mp3');
export const capture = new Audio('/sounds/capture.mp3');
export const castle = new Audio('/sounds/castle.mp3');
export const gameEnd = new Audio('/sounds/game-end.mp3');
export const moveCheck = new Audio('/sounds/move-check.mp3');
export const promote = new Audio('/sounds/promote.mp3');
