import { useRef, useEffect } from 'react'
import type { GameState } from './types.ts';

export function MoveTimeline( { positions }: { positions: GameState[] }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.scrollLeft = barRef.current.scrollWidth;
    }
  }, [positions]);

  return (
    <div className="move-timeline" ref={barRef}> 
      {positions.slice(1).map((state, index) => {
        // numbers only on white moves
        return <div key={index} className="move">{state.turn === 'b' ? state.fullmoveNumber + '.' : ''}{state.san}</div>;
      })}
    </div>
  );
}
