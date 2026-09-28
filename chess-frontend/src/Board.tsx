import type {
  Board as BoardType,
  Square as SquareType,
  Position,
  LastMove,
} from './types.ts';
import type { CSSProperties } from 'react';

function SquareCell({
  piece,
  row,
  col,
  isSelected,
  slideFrom,
  isValidDestination,
  onClick,
}: {
  piece: SquareType;
  row: number;
  col: number;
  isSelected: boolean;
  slideFrom: Position | null;
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
        slideFrom ? 
        <img className="moving" style={{ '--dx': `${100*(slideFrom.col-col)}%`, '--dy': `${100*(slideFrom.row-row)}%` } as CSSProperties}
          src={`/pieces/${piece.type}${piece.color}.svg`}
          alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
        /> :
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
  lastMove,
  validMoves,
  onSquareClick,
}: {
  board: BoardType;
  selectedSquare: Position | null;
  lastMove: LastMove | null;
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
            slideFrom={
              rowIndex === lastMove?.to.row &&
              colIndex === lastMove?.to.col ? lastMove.from : null
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
