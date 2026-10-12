import { toUci } from './uci.ts';
import type { GameHistory, RepertoireNode } from './types.ts';

/**
 * Returns the moves played to reach the current position, in UCI, from the starting position.
 * Undone moves are not included.
 */
export function getPath(gameHistory: GameHistory): string[] {
  // ignore start state and future moves after undoing
  const path = gameHistory.history
    .slice(1, gameHistory.currentIndex + 1)
    .map((state) => {
      return toUci(state.lastMove!);
    });
  return path;
}

/**
 * Follows `path` down from `root` and returns the node it ends on, or null if the
 * path leaves the repertoire. An empty path returns `root`.
 * @param path Moves in UCI, starting from `root`.
 */
export function findNode(
  root: RepertoireNode,
  path: string[],
): RepertoireNode | null {
  let currentNode = root;
  for (const move of path) {
    const childNode = currentNode.children.find((node) => node.move === move);
    if (!childNode) {
      return null;
    } else {
      currentNode = childNode;
    }
  }
  return currentNode;
}

/**
 * Returns a new tree with `move` added after `path`. The original tree is never modified.
 * If the move already exists there, returns `node` unchanged.
 * @param path Moves in UCI, starting from `node`.
 * @param move Move in UCI to add.
 */
export function addMove(
  node: RepertoireNode,
  path: string[],
  move: string,
): RepertoireNode {
  // base case: add move to this line
  if (path.length === 0) {
    if (node.children.some((child) => child.move === move)) {
      return node;
    }
    return { ...node, children: [...node.children, { move, children: [] }] };
  }

  const nextMove = path[0];
  const restOfPath = path.slice(1);

  const newChildren = node.children.map((child) => {
    if (child.move === nextMove) {
      // recurse down this line
      return addMove(child, restOfPath, move);
    }
    // leave other lines untouched
    return child;
  });

  return { ...node, children: newChildren };
}

/**
 * Returns a new tree with `move` and all subsequent children removed. The original tree is never modified.
 * @param path Moves in UCI, starting from `node`.
 * @param move Move in UCI to add.
 */
export function removeMove(
  node: RepertoireNode,
  path: string[],
  move: string,
): RepertoireNode {
  // base case
  if (path.length === 0) {
    if (node.children.some((child) => child.move === move)) {
      return { ...node, children: node.children.filter((child) => child.move !== move) } 
    }
    return node;
  }

  // move down path
  const nextMove = path[0];
  const restOfPath = path.slice(1);
  
  const newChildren = node.children.map((child) => {
    if (child.move === nextMove) {
      // recurse down this line
      return removeMove(child, restOfPath, move);
    }
    // leave other lines untouched
    return child;
  })

  return { ...node, children: newChildren };
}
