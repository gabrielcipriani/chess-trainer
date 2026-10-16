import type { RepertoireNode } from './types';

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchRepertoireTree(
  repertoireId: number,
): Promise<RepertoireNode> {
  const url = `${API_URL}/repertoires/${repertoireId}/tree`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) {
    throw new Error(`Failed to fetch repertoire: ${response.status}`);
  }
  const repertoire = await response.json();
  return repertoire;
}

export async function saveRepertoireTree(
  repertoireId: number,
  tree: RepertoireNode,
): Promise<void> {
  const url = `${API_URL}/repertoires/${repertoireId}/tree`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tree),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Failed to save repertoire: ${response.status}`);
  }
}
