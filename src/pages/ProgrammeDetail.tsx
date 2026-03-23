import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { programmes } from '../data/programmes';
import { useProgress } from '../hooks/useProgress';
import { useEffect } from 'react';

export default function ProgrammeDetail() {
  const { id } = useParams<{ id: string }>();
  const programme = programmes.find((p) => p.id === id);
  const { programmeProgress, initProgress } = useProgress(id);

  const sessions = useLiveQuery(
    () => (id ? db.sessions.where('programmeId').equals(id).reverse().sortBy('date') : []),
    [id],
  );

  useEffect(() => {
    if (id && programme) {
      initProgress(id);
    }
  }, [id, programme]);

  if (!programme) {
    return (
      <div className="page">
        <h2>Programme not found</h2>
        <Link to="/programmes" className="btn btn-secondary">Back to Programmes</Link>
      </div>
    );
  }

  const currentLevel = programmeProgress?.currentLevel || 1;

  return (
    <div className="page">
      <Link to="/programmes" className="back-link">← Back to Programmes</Link>
      <div className="prog-detail-header">
        <span className="prog-icon large">{programme.icon}</span>
        <div>
          <h2>{programme.name}</h2>
          <p>{programme.description}</p>
        </div>
      </div>

      <div className="levels-list">
        {programme.levels.map((level) => {
          const isComplete = programmeProgress?.completedLevels?.includes(level.level);
          const isCurrent = level.level === currentLevel;
          const levelSessions = sessions?.filter((s) => s.level === level.level) || [];

          return (
            <div
              key={level.level}
              className={`level-card ${isCurrent ? 'current' : ''} ${isComplete ? 'complete' : ''}`}
            >
              <div className="level-header">
                <span className="level-number">
                  {isComplete ? '✅' : isCurrent ? '🔵' : '⚪'} Level {level.level}
                </span>
                <span className="level-title">{level.title}</span>
              </div>

              <div className="level-body">
                <p>{level.description}</p>
                <div className="criteria">
                  <div className="criteria-item success">
                    <strong>Success:</strong> {level.successCriteria}
                  </div>
                  <div className="criteria-item fail">
                    <strong>Fail:</strong> {level.failureCriteria}
                  </div>
                  <div className="criteria-item info">
                    <strong>Session:</strong> {level.sessionLength}
                  </div>
                </div>

                {level.tips && level.tips.length > 0 && (
                  <div className="tips">
                    <strong>Tips:</strong>
                    <ul>
                      {level.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {levelSessions.length > 0 && (
                  <div className="level-sessions">
                    <strong>{levelSessions.length} session{levelSessions.length !== 1 ? 's' : ''} logged</strong>
                  </div>
                )}

                <Link
                  to={`/log-session?programme=${programme.id}&level=${level.level}`}
                  className="btn btn-primary"
                >
                  📝 Log Session at This Level
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
