import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '../db';
import { programmes } from '../data/programmes';
import { useProgress } from '../hooks/useProgress';
import type { Session } from '../types';

export default function LogSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [programmeId, setProgrammeId] = useState(searchParams.get('programme') || '');
  const [level, setLevel] = useState(Number(searchParams.get('level')) || 1);
  const [duration, setDuration] = useState(300);
  const [successReps, setSuccessReps] = useState(0);
  const [failReps, setFailReps] = useState(0);
  const [quickRating, setQuickRating] = useState<'good' | 'mixed' | 'regression'>('good');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const { programmeProgress, initProgress, advanceLevel, regressLevel } = useProgress(programmeId);

  useEffect(() => {
    if (programmeId) {
      initProgress(programmeId);
    }
  }, [programmeId]);

  useEffect(() => {
    if (programmeProgress && !searchParams.get('level')) {
      setLevel(programmeProgress.currentLevel);
    }
  }, [programmeProgress, searchParams]);

  const programme = programmes.find((p) => p.id === programmeId);
  const currentLevelData = programme?.levels.find((l) => l.level === level);

  function determineOutcome(): 'advance' | 'repeat' | 'regress' {
    if (quickRating === 'regression') return 'regress';
    if (quickRating === 'good') return 'advance';
    return 'repeat';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!programmeId) return;
    setSaving(true);

    const outcome = determineOutcome();
    const session: Session = {
      programmeId,
      level,
      date: new Date().toISOString().split('T')[0],
      duration,
      successReps,
      failReps,
      outcome,
      quickRating,
      notes,
    };

    await db.sessions.add(session);

    if (outcome === 'advance' && programme && level < programme.levels.length) {
      await advanceLevel(programmeId, level);
    } else if (outcome === 'regress') {
      await regressLevel(programmeId, level);
    }

    navigate(`/programmes/${programmeId}`);
  }

  return (
    <div className="page">
      <h2>Log Training Session</h2>

      <form onSubmit={handleSubmit} className="form">
        <label className="form-field">
          <span>Programme</span>
          <select
            value={programmeId}
            onChange={(e) => {
              setProgrammeId(e.target.value);
              setLevel(1);
            }}
            required
          >
            <option value="">Select programme...</option>
            {programmes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
        </label>

        {programme && (
          <label className="form-field">
            <span>Level</span>
            <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
              {programme.levels.map((l) => (
                <option key={l.level} value={l.level}>
                  Level {l.level}: {l.title}
                </option>
              ))}
            </select>
          </label>
        )}

        {currentLevelData && (
          <div className="level-info-box">
            <p><strong>{currentLevelData.title}</strong></p>
            <p>{currentLevelData.description}</p>
            <p className="criteria-inline">
              ✅ {currentLevelData.successCriteria}
            </p>
          </div>
        )}

        <label className="form-field">
          <span>Duration: {Math.floor(duration / 60)}m {duration % 60}s</span>
          <input
            type="range"
            min={30}
            max={1800}
            step={30}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>

        <div className="form-row">
          <label className="form-field">
            <span>Successes</span>
            <div className="counter-input">
              <button type="button" onClick={() => setSuccessReps(Math.max(0, successReps - 1))}>−</button>
              <span>{successReps}</span>
              <button type="button" onClick={() => setSuccessReps(successReps + 1)}>+</button>
            </div>
          </label>

          <label className="form-field">
            <span>Fails</span>
            <div className="counter-input">
              <button type="button" onClick={() => setFailReps(Math.max(0, failReps - 1))}>−</button>
              <span>{failReps}</span>
              <button type="button" onClick={() => setFailReps(failReps + 1)}>+</button>
            </div>
          </label>
        </div>

        <fieldset className="form-field">
          <legend>How did it go?</legend>
          <div className="rating-buttons">
            {(['good', 'mixed', 'regression'] as const).map((r) => (
              <button
                key={r}
                type="button"
                className={`rating-btn ${quickRating === r ? 'active' : ''} rating-${r}`}
                onClick={() => setQuickRating(r)}
              >
                {r === 'good' ? '👍 Good' : r === 'mixed' ? '🤷 Mixed' : '👎 Regression'}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="form-field">
          <span>Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What happened? Any observations..."
            rows={3}
          />
        </label>

        <button type="submit" className="btn btn-primary full-width" disabled={!programmeId || saving}>
          {saving ? 'Saving...' : 'Save Session'}
        </button>
      </form>
    </div>
  );
}
