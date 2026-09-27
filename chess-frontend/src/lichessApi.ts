import type { ExplorerResponse } from './types.ts';

const RATINGS = "1000";
const SPEEDS = "blitz,rapid,classical";
const VARIANT = 'standard';

export async function fetchOpeningStats(fen: string): Promise<ExplorerResponse> {
  const params = new URLSearchParams({
    fen: fen,
    ratings: RATINGS,
    speeds: SPEEDS,
    variant: VARIANT
  })

  const url = `https://explorer.lichess.org/lichess?${params}`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_LICHESS_TOKEN}`
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch opening stats: ${response.status}`);
  }
  const data = await response.json();
  return data;
}