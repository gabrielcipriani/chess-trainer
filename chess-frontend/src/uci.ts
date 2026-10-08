import type { LastMove } from './types.ts';

export function toUci(move: LastMove): string {
  const { row: fromRow, col: fromCol } = move.from;
  const { row: toRow, col: toCol } = move.to;

  const files = 'abcdefgh';
  let uciMove =
    files[fromCol] + `${8 - fromRow}` + files[toCol] + `${8 - toRow}`;
  if (move.type === 'p' && (toRow === 0 || toRow === 7)) {
    // auto queen promotion
    uciMove += 'q'
  }
  return uciMove;
}
