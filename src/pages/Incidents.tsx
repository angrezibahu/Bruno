import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { db } from '../db';

export default function Incidents() {
  const incidents = useLiveQuery(() =>
    db.incidents.orderBy('date').reverse().toArray(),
  );

  return (
    <div className="page">
      <div className="page-header-row">
        <h2>Incidents</h2>
        <Link to="/incidents/new" className="btn btn-primary">+ Log Incident</Link>
      </div>
      <p className="page-desc">Track reactive incidents, triggers, and patterns to inform training.</p>

      {(!incidents || incidents.length === 0) ? (
        <div className="empty-state">
          <span className="empty-icon">📋</span>
          <p>No incidents logged yet.</p>
          <p>Log incidents when they happen to spot patterns over time.</p>
        </div>
      ) : (
        <ul className="session-list">
          {incidents.map((inc) => (
            <li key={inc.id} className="session-item incident-item">
              <div className="session-info">
                <strong>{inc.trigger}</strong>
                <span>{inc.date} · {inc.time}</span>
                <p className="incident-desc">{inc.description}</p>
              </div>
              <div className="incident-meta">
                <span className={`severity severity-${inc.severity}`}>
                  Severity {inc.severity}/5
                </span>
                <span className="incident-action">{inc.action}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
