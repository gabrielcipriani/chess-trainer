import type { LastMove, Position } from './types.ts';

export function toUci(move: LastMove): string {
  const { row: fromRow, col: fromCol } = move.from;
  const { row: toRow, col: toCol } = move.to;

  const files = 'abcdefgh';
  let uciMove =
    files[fromCol] + `${8 - fromRow}` + files[toCol] + `${8 - toRow}`;
  if (move.type === 'p' && (toRow === 0 || toRow === 7)) {
    // auto queen promotion
    uciMove += 'q';
  }
  return uciMove;
}

export function fromUci(uci: string): { from: Position; to: Position } {
  // e2e4 -> from: {row: 6, col: 4}, to: {row: 4, col: 4}
  const files = 'abcdefgh';
  const from = { row: 8 - Number(uci[1]), col: files.indexOf(uci[0]) };
  const to = { row: 8 - Number(uci[3]), col: files.indexOf(uci[2]) };
  return { from, to };
}
