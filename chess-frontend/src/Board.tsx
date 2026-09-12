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
  onDragMove,
  onDragEnd,
}: {
  piece: SquareType;
  isSelected: boolean;
  isValidDestination: boolean;
  onClick: () => void;
  onGrab: (x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
}) {
  return (
    <div className={`square${isSelected ? ' selected' : ''}`} onClick={onClick}>
      {piece && (
        <img
          src={`/pieces/${piece.type}${piece.color}.svg`}
          alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            onGrab(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => {
            onDragMove(event.clientX, event.clientY);
          }}
          onPointerUp={onDragEnd}
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
  onDragMove,
  onDragEnd,
}: {
  board: BoardType;
  selectedSquare: Position | null;
  validMoves: Position[] | null;
  onSquareClick: (rowIndex: number, colIndex: number) => void;
  onPieceGrab: (
    rowIndex: number,
    colIndex: number,
    x: number,
    y: number,
  ) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
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
            onGrab={(x, y) => onPieceGrab(rowIndex, colIndex, x, y)}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        )),
      )}
    </div>
  );
}
