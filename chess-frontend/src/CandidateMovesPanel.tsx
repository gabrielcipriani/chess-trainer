import type { CandidateMove } from './types.ts';

interface CandidateMovesPanelProps {
  moves: CandidateMove[];
  savedMoves: string[];
  onMoveClick: (uci: string) => void;
}

export function CandidateMovesPanel({ moves, savedMoves, onMoveClick }: CandidateMovesPanelProps) {
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
            <button onClick={() => onMoveClick(move.uci)}>
              <div>{move.san}{savedMoves.includes(move.uci) && <span>✓</span>}</div>
              <div>{Math.round(move.playedPercent)}%</div>
              <div className="result-bar">
                <div className="result-white" style={{ width: `${move.whitePercent}%`}}>{Math.round(move.whitePercent)}</div>
                <div className="result-draw" style={{ width: `${move.drawPercent}%`}}></div>
                <div className="result-black" style={{ width: `${move.blackPercent}%`}}>{Math.round(move.blackPercent)}</div>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}