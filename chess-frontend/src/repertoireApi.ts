import type { RepertoireNode } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchRepertoireTree(
  repertoireId: number,
): Promise<RepertoireNode> {
  const url = `${API_URL}/repertoires/${repertoireId}/tree`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch repertoire: ${response.status}`);
  }
  const repertoire = await response.json();
  return repertoire;
}
