import type { Board } from './types';

export function emptyBoard(): Board {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}
