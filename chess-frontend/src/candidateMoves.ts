import type { CandidateMove, ExplorerResponse } from './types.ts'

// converts lichess explorer response to an array of candidate moves
export function toCandidateMoves(response: ExplorerResponse): CandidateMove[] {
  return response.moves.map((move) => {
    const moveTotal = move.white + move.black + move.draws;
    return {
      san: move.san,
      uci: move.uci,
      playedPercent: 100 * moveTotal / (response.white + response.black + response.draws),
      whitePercent: 100 * move.white / (moveTotal),   
      drawPercent: 100 * move.draws / (moveTotal),
      blackPercent: 100 * move.black / (moveTotal),
    }});
}