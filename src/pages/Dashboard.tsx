import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { db } from '../db';
import { programmes } from '../data/programmes';

export default function Dashboard() {
  const recentSessions = useLiveQuery(() =>
    db.sessions.orderBy('date').reverse().limit(5).toArray(),
  );
  const allProgress = useLiveQuery(() => db.progress.toArray());
  const recentIncidents = useLiveQuery(() =>
    db.incidents.orderBy('date').reverse().limit(3).toArray(),
  );

  const today = new Date().toISOString().split('T')[0];
  const todaySessions = recentSessions?.filter((s) => s.date === today) || [];
  const streak = calculateStreak(recentSessions?.map((s) => s.date) || []);

  return (
    <div className="dashboard">
      <div className="greeting-card">
        <div className="greeting-emoji">🐕</div>
        <h2>Hey there!</h2>
        <p>
          {todaySessions.length === 0
            ? "No training yet today. Let's get started!"
            : `${todaySessions.length} session${todaySessions.length > 1 ? 's' : ''} logged today. Great work!`}
        </p>
        {streak > 1 && <p className="streak-badge">🔥 {streak} day streak!</p>}
      </div>

      <section className="dash-section">
        <h3>Active Programmes</h3>
        <div className="programme-grid">
          {programmes.map((prog) => {
            const progress = allProgress?.find((p) => p.programmeId === prog.id);
            return (
              <Link to={`/programmes/${prog.id}`} key={prog.id} className="programme-card">
                <span className="prog-icon">{prog.icon}</span>
                <div className="prog-info">
                  <strong>{prog.name}</strong>
                  <span className="prog-level">
                    Level {progress?.currentLevel || 1} / {prog.levels.length}
                  </span>
                </div>
                {progress && (
                  <div className="prog-bar">
                    <div
                      className="prog-bar-fill"
                      style={{ width: `${((progress.currentLevel - 1) / prog.levels.length) * 100}%` }}
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {recentSessions && recentSessions.length > 0 && (
        <section className="dash-section">
          <h3>Recent Sessions</h3>
          <ul className="session-list">
            {recentSessions.map((s) => {
              const prog = programmes.find((p) => p.id === s.programmeId);
              return (
                <li key={s.id} className="session-item">
                  <span className="session-icon">{prog?.icon || '📝'}</span>
                  <div className="session-info">
                    <strong>{prog?.name || s.programmeId}</strong>
                    <span>Level {s.level} · {s.date}</span>
                  </div>
                  <span className={`outcome-badge outcome-${s.outcome}`}>
                    {s.outcome === 'advance' ? '⬆️' : s.outcome === 'regress' ? '⬇️' : '🔄'}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {recentIncidents && recentIncidents.length > 0 && (
        <section className="dash-section">
          <h3>Recent Incidents</h3>
          <ul className="session-list">
            {recentIncidents.map((inc) => (
              <li key={inc.id} className="session-item">
                <span className="session-icon">⚠️</span>
                <div className="session-info">
                  <strong>{inc.trigger}</strong>
                  <span>Severity {inc.severity}/5 · {inc.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="quick-actions">
        <Link to="/log-session" className="btn btn-primary">📝 Log Session</Link>
        <Link to="/incidents/new" className="btn btn-secondary">⚠️ Log Incident</Link>
      </div>
    </div>
  );
}

function calculateStreak(dates: string[]): number {
  if (!dates.length) return 0;
  const unique = [...new Set(dates)].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  if (unique[0] !== today) return 0;
  let streak = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(unique[i - 1]);
    const curr = new Date(unique[i]);
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
