import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { programmes } from '../data/programmes';

export default function ProgrammeList() {
  const allProgress = useLiveQuery(() => db.progress.toArray());

  return (
    <div className="page">
      <h2>Training Programmes</h2>
      <p className="page-desc">Choose a programme to view levels and log training sessions.</p>
      <div className="programme-grid full">
        {programmes.map((prog) => {
          const progress = allProgress?.find((p) => p.programmeId === prog.id);
          const currentLevel = progress?.currentLevel || 1;
          return (
            <Link to={`/programmes/${prog.id}`} key={prog.id} className="programme-card detailed">
              <div className="prog-header">
                <span className="prog-icon large">{prog.icon}</span>
                <div>
                  <strong>{prog.name}</strong>
                  <p className="prog-desc">{prog.description}</p>
                </div>
              </div>
              <div className="prog-meta">
                <span className="prog-level">
                  Level {currentLevel} of {prog.levels.length}
                </span>
                <div className="prog-bar">
                  <div
                    className="prog-bar-fill"
                    style={{ width: `${((currentLevel - 1) / prog.levels.length) * 100}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
