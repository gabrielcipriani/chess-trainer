import type {
  Board as BoardType,
  Square as SquareType,
  Position,
} from './types.ts';

function SquareCell({
  piece,
  isSelected,
  isValidDestination,
  onClick,
  onGrab,
}: {
  piece: SquareType;
  isSelected: boolean;
  isValidDestination: boolean;
  onClick: () => void;
  onGrab: () => void;
}) {
  return (
    <div
      className={`square${isSelected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {piece && (
        <img
          src={`/pieces/${piece.type}${piece.color}.svg`}
          alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
          onPointerDown={onGrab}
        />
      )}
      {isValidDestination && <div className="valid-move-marker"></div>}
    </div>
  );
}

export function Board({
  board,
  selectedSquare,
  validMoves,
  onSquareClick,
  onPieceGrab,
}: {
  board: BoardType;
  selectedSquare: Position | null;
  validMoves: Position[] | null;
  onSquareClick: (rowIndex: number, colIndex: number) => void;
  onPieceGrab: (rowIndex: number, colIndex: number) => void;
}) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <SquareCell
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            isSelected={
              selectedSquare?.row === rowIndex &&
              selectedSquare?.col === colIndex
            }
            isValidDestination={(validMoves ?? []).some(
              (move) => move.row === rowIndex && move.col === colIndex,
            )}
            onClick={() => onSquareClick(rowIndex, colIndex)}
            onGrab={() => onPieceGrab(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
}
