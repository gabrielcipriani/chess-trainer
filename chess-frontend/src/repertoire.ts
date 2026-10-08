import { toUci } from './uci.ts'
import type { GameHistory } from './types.ts'

export function getPath(gameHistory: GameHistory): string[] {
  // ignore start state and future moves after undoing
  const path = gameHistory.history.slice(1, gameHistory.currentIndex + 1).map((state) => {
    return toUci(state.lastMove!)
  })
  return path
}