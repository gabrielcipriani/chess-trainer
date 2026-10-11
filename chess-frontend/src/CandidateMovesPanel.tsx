import type { CandidateMove } from './types.ts';
import { Trash2 } from 'lucide-react';

interface CandidateMovesPanelProps {
  moves: CandidateMove[];
  savedMoves: string[];
  onMoveClick: (uci: string) => void;
  onTrashClick: (uci: string) => void;
}

export function CandidateMovesPanel({
  moves,
  savedMoves,
  onMoveClick,
  onTrashClick,
}: CandidateMovesPanelProps) {
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
            <button className="move-row" onClick={() => onMoveClick(move.uci)}>
              <div>
                {move.san}
                {savedMoves.includes(move.uci) && <span>✓</span>}
              </div>
              <div>{Math.round(move.playedPercent)}%</div>
              <div className="result-bar">
                <div
                  className="result-white"
                  style={{ width: `${move.whitePercent}%` }}
                >
                  {Math.round(move.whitePercent)}
                </div>
                <div
                  className="result-draw"
                  style={{ width: `${move.drawPercent}%` }}
                ></div>
                <div
                  className="result-black"
                  style={{ width: `${move.blackPercent}%` }}
                >
                  {Math.round(move.blackPercent)}
                </div>
              </div>
            </button>
            <button
              className="remove-move"
              aria-label="Remove move"
              onClick={() => onTrashClick(move.uci)}
            >
              {savedMoves.includes(move.uci) && <Trash2 size={16} />}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
