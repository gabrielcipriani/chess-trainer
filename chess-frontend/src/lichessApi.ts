import type { ExplorerResponse } from './types.ts';

export async function fetchOpeningStats(fen: string): Promise<ExplorerResponse> {

  const url = `/api/explorer?fen=${encodeURIComponent(fen)}`
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch opening stats: ${response.status}`);
  }
  const data = await response.json();
  return data;
}