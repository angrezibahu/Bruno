import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { programmes } from '../data/programmes';
import { useState } from 'react';

export default function History() {
  const sessions = useLiveQuery(() =>
    db.sessions.orderBy('date').reverse().toArray(),
  );
  const [filter, setFilter] = useState('all');

  const filtered = sessions?.filter((s) => filter === 'all' || s.programmeId === filter) || [];

  const stats = {
    total: filtered.length,
    advances: filtered.filter((s) => s.outcome === 'advance').length,
    repeats: filtered.filter((s) => s.outcome === 'repeat').length,
    regressions: filtered.filter((s) => s.outcome === 'regress').length,
    totalDuration: filtered.reduce((sum, s) => sum + s.duration, 0),
  };

  const last7 = getLast7DaysData(filtered);

  return (
    <div className="page">
      <h2>Training History</h2>

      <label className="form-field">
        <span>Filter by programme</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Programmes</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.icon} {p.name}
            </option>
          ))}
        </select>
      </label>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{Math.round(stats.totalDuration / 60)}m</span>
          <span className="stat-label">Total Time</span>
        </div>
        <div className="stat-card advance">
          <span className="stat-value">{stats.advances}</span>
          <span className="stat-label">Advances</span>
        </div>
        <div className="stat-card regress">
          <span className="stat-value">{stats.regressions}</span>
          <span className="stat-label">Regressions</span>
        </div>
      </div>

      <section className="dash-section">
        <h3>Last 7 Days</h3>
        <div className="bar-chart">
          {last7.map((day) => (
            <div key={day.label} className="bar-col">
              <div
                className="bar"
                style={{ height: `${Math.max(day.count * 20, day.count > 0 ? 8 : 0)}px` }}
              >
                {day.count > 0 && <span>{day.count}</span>}
              </div>
              <span className="bar-label">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No sessions logged yet.</p>
        </div>
      ) : (
        <ul className="session-list">
          {filtered.map((s) => {
            const prog = programmes.find((p) => p.id === s.programmeId);
            return (
              <li key={s.id} className="session-item">
                <span className="session-icon">{prog?.icon || '📝'}</span>
                <div className="session-info">
                  <strong>{prog?.name || s.programmeId}</strong>
                  <span>
                    Level {s.level} · {s.date} · {Math.round(s.duration / 60)}m
                  </span>
                  <span>
                    ✅ {s.successReps} / ❌ {s.failReps}
                  </span>
                  {s.notes && <p className="session-notes">{s.notes}</p>}
                </div>
                <span className={`outcome-badge outcome-${s.outcome}`}>
                  {s.outcome === 'advance' ? '⬆️' : s.outcome === 'regress' ? '⬇️' : '🔄'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function getLast7DaysData(sessions: { date: string }[]) {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      label: dayNames[d.getDay()],
      count: sessions.filter((s) => s.date === dateStr).length,
    });
  }
  return days;
}
