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
  console.log(url)
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_LICHESS_TOKEN}`
    }
  });
  if (!response.ok) {
    // console.log(await response.text());
    throw new Error(`Failed to fetch opening stats: ${response.status}`);
  }
  console.log(response.status, response.ok)
  const data = await response.json();
  console.log(data);
  return data;
}