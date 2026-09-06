import type { Board as BoardType, Square as SquareType } from './types.ts';

function SquareCell({ piece }: { piece: SquareType }) {
  return (
    <div className="square">
      {piece && (
        <img
          src={`/pieces/${piece.type}${piece.color}.svg`}
          alt={`${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}`}
        />
      )}
    </div>
  );
}

export function Board({ board }: { board: BoardType }) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <SquareCell key={`${rowIndex}-${colIndex}`} piece={piece} />
        )),
      )}
    </div>
  );
}
