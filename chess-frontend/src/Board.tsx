import type {
  Board as BoardType,
  Square as SquareType,
  Position,
} from './types.ts';

function SquareCell({
  piece,
  row,
  col,
  isSelected,
  isValidDestination,
  onClick,
}: {
  piece: SquareType;
  row: number;
  col: number;
  isSelected: boolean;
  isValidDestination: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`square${isSelected ? ' selected' : ''}`}
      data-row={row}
      data-col={col}
      onClick={onClick}
    >
      {piece && (
        <img
          src={`/pieces/${piece.type}${piece.color}.svg`}
          alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
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
}: {
  board: BoardType;
  selectedSquare: Position | null;
  validMoves: Position[] | null;
  onSquareClick: (rowIndex: number, colIndex: number) => void;
}) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <SquareCell
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            row={rowIndex}
            col={colIndex}
            isSelected={
              selectedSquare?.row === rowIndex &&
              selectedSquare?.col === colIndex
            }
            isValidDestination={(validMoves ?? []).some(
              (move) => move.row === rowIndex && move.col === colIndex,
            )}
            onClick={() => onSquareClick(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  );
}
