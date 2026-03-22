import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../db';
import type { Incident } from '../types';

const COMMON_TRIGGERS = ['Dog', 'Person', 'Bicycle', 'Car', 'Cat', 'Squirrel', 'Jogger', 'Child', 'Noise', 'Other'];

export default function IncidentForm() {
  const navigate = useNavigate();
  const now = new Date();

  const [date, setDate] = useState(now.toISOString().split('T')[0]);
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [trigger, setTrigger] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const incident: Incident = {
      date,
      time,
      trigger,
      description,
      severity,
      action,
      notes,
    };

    await db.incidents.add(incident);
    navigate('/incidents');
  }

  return (
    <div className="page">
      <Link to="/incidents" className="back-link">← Back to Incidents</Link>
      <h2>Log Incident</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <label className="form-field">
            <span>Date</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <label className="form-field">
            <span>Time</span>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
          </label>
        </div>

        <label className="form-field">
          <span>Trigger</span>
          <div className="chip-select">
            {COMMON_TRIGGERS.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip ${trigger === t ? 'active' : ''}`}
                onClick={() => setTrigger(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </label>

        <label className="form-field">
          <span>What happened?</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident..."
            rows={3}
            required
          />
        </label>

        <label className="form-field">
          <span>Severity: {severity}/5</span>
          <input
            type="range"
            min={1}
            max={5}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>Mild</span>
            <span>Severe</span>
          </div>
        </label>

        <label className="form-field">
          <span>What action did you take?</span>
          <textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="e.g., U-turned, scattered treats, increased distance..."
            rows={2}
          />
        </label>

        <label className="form-field">
          <span>Additional notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other observations..."
            rows={2}
          />
        </label>

        <button type="submit" className="btn btn-primary full-width" disabled={!trigger || saving}>
          {saving ? 'Saving...' : 'Save Incident'}
        </button>
      </form>
    </div>
  );
}
