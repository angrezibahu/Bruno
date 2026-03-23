import { useState } from 'react';
import { programmes } from '../data/programmes';

export default function TrainingGuide() {
  const [expandedProgramme, setExpandedProgramme] = useState<string | null>(null);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  const toggleProgramme = (id: string) => {
    setExpandedProgramme(expandedProgramme === id ? null : id);
    setExpandedLevel(null);
  };

  const toggleLevel = (key: string) => {
    setExpandedLevel(expandedLevel === key ? null : key);
  };

  return (
    <div className="page">
      <h2>Training Guide</h2>
      <p className="page-desc">
        Read about each programme and every stage of training before you start. Tap a programme to explore its levels.
      </p>

      <div className="guide-list">
        {programmes.map((prog) => (
          <div key={prog.id} className="guide-programme">
            <button
              className={`guide-programme-header ${expandedProgramme === prog.id ? 'expanded' : ''}`}
              onClick={() => toggleProgramme(prog.id)}
            >
              <span className="prog-icon">{prog.icon}</span>
              <div className="guide-programme-info">
                <strong>{prog.name}</strong>
                <span>{prog.description}</span>
              </div>
              <span className="guide-chevron">{expandedProgramme === prog.id ? '▲' : '▼'}</span>
            </button>

            {expandedProgramme === prog.id && (
              <div className="guide-levels">
                {prog.levels.map((level) => {
                  const key = `${prog.id}-${level.level}`;
                  return (
                    <div key={key} className="guide-level">
                      <button
                        className={`guide-level-header ${expandedLevel === key ? 'expanded' : ''}`}
                        onClick={() => toggleLevel(key)}
                      >
                        <span className="guide-level-num">Level {level.level}</span>
                        <span className="guide-level-title">{level.title}</span>
                        <span className="guide-chevron-sm">{expandedLevel === key ? '−' : '+'}</span>
                      </button>

                      {expandedLevel === key && (
                        <div className="guide-level-body">
                          <p>{level.description}</p>
                          <div className="criteria">
                            <div className="criteria-item success">
                              <strong>Success:</strong> {level.successCriteria}
                            </div>
                            <div className="criteria-item fail">
                              <strong>Fail:</strong> {level.failureCriteria}
                            </div>
                            <div className="criteria-item info">
                              <strong>Session length:</strong> {level.sessionLength}
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
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
