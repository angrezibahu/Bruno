import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, exportData, importData } from '../db';
import { DEFAULT_SETTINGS } from '../types';
import type { AppSettings } from '../types';

export default function Settings() {
  const savedSettings = useLiveQuery(() => db.settings.get(1));
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [importStatus, setImportStatus] = useState('');

  useEffect(() => {
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, [savedSettings]);

  async function handleSave() {
    await db.settings.put({ ...settings, id: 1 });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleExport() {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bruno-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importData(text);
      setImportStatus('Data imported successfully!');
    } catch {
      setImportStatus('Import failed. Check file format.');
    }
    setTimeout(() => setImportStatus(''), 3000);
  }

  async function handleClearData() {
    if (!window.confirm('Are you sure? This will delete ALL training data. This cannot be undone.')) return;
    await db.sessions.clear();
    await db.incidents.clear();
    await db.progress.clear();
    setImportStatus('All data cleared.');
    setTimeout(() => setImportStatus(''), 3000);
  }

  return (
    <div className="page">
      <h2>Settings</h2>

      <div className="form">
        <label className="form-field">
          <span>Recall Cue</span>
          <input
            type="text"
            value={settings.recallCue}
            onChange={(e) => setSettings({ ...settings, recallCue: e.target.value })}
          />
        </label>

        <label className="form-field">
          <span>Release Word</span>
          <input
            type="text"
            value={settings.releaseWord}
            onChange={(e) => setSettings({ ...settings, releaseWord: e.target.value })}
          />
        </label>

        <label className="form-field">
          <span>Marker Word</span>
          <input
            type="text"
            value={settings.markerWord}
            onChange={(e) => setSettings({ ...settings, markerWord: e.target.value })}
          />
        </label>

        <button onClick={handleSave} className="btn btn-primary full-width">
          {saved ? '✅ Saved!' : 'Save Settings'}
        </button>
      </div>

      <section className="dash-section">
        <h3>Data Management</h3>
        <div className="settings-actions">
          <button onClick={handleExport} className="btn btn-secondary full-width">
            📦 Export Backup
          </button>
          <label className="btn btn-secondary full-width file-input-label">
            📂 Import Backup
            <input type="file" accept=".json" onChange={handleImport} hidden />
          </label>
          <button onClick={handleClearData} className="btn btn-danger full-width">
            🗑️ Clear All Data
          </button>
        </div>
        {importStatus && <p className="status-msg">{importStatus}</p>}
      </section>
    </div>
  );
}
