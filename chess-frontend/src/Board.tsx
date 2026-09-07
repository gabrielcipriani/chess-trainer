import type {
  Board as BoardType,
  Square as SquareType,
  Position,
} from './types.ts';

function SquareCell({
  piece,
  isSelected,
  onClick,
}: {
  piece: SquareType;
  isSelected: boolean,
  onClick: () => void;
}) {
  return (
    <div
      className={`square' ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {piece && (
        <img
          src={`/pieces/${piece.type}${piece.color}.svg`}
          alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
        />
      )}
    </div>
  );
}

export function Board({
  board,
  selectedSquare,
  onSquareClick,
}: {
  board: BoardType;
  selectedSquare: Position | null;
  onSquareClick: (rowIndex: number, colIndex: number) => void;
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
            onClick={() => onSquareClick(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
}
