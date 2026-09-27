import type { CandidateMove } from './types.ts';

export function CandidateMovesPanel({ moves }: { moves: CandidateMove[] }) {
  return (
    <div>
      <h2>Candidate Moves</h2>
      <div className="candidate-header">
        <div>Move</div>
        <div>Played</div>
        <div>Results</div>
      </div>
      <ol className="candidate-list">
        {moves.map((move) => (
          <li key={move.uci}>
            <div>{move.san}</div>
            <div>{Math.round(move.playedPercent)}%</div>
            <div className="result-bar">
              <div className="result-white" style={{ width: `${move.whitePercent}%`}}>{Math.round(move.whitePercent)}</div>
              <div className="result-draw" style={{ width: `${move.drawPercent}%`}}></div>
              <div className="result-black" style={{ width: `${move.blackPercent}%`}}>{Math.round(move.blackPercent)}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
