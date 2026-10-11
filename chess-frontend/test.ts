import { findNode, addMove } from './src/repertoire.ts';
import type { RepertoireNode } from './src/types.ts';
import { fromUci, toUci } from './src/uci.ts';

const repertoire: RepertoireNode = {
  move: null,
  children: [
    {
      move: 'e2e4',
      children: [
        { move: 'c7c5', children: [] },
        { move: 'e7e5', children: [{ move: 'g1f3', children: [] }] },
        { move: 'e7e6', children: [] },
      ],
    },
    { move: 'd2d4', children: [] },
  ],
};

console.log(toUci({ ...fromUci('e7e8q'), type: 'p' }));
