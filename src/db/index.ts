import Dexie, { type Table } from 'dexie';
import type { Session, Incident, UserProgress, AppSettings } from '../types';

class BrunoDB extends Dexie {
  sessions!: Table<Session, number>;
  incidents!: Table<Incident, number>;
  progress!: Table<UserProgress, number>;
  settings!: Table<AppSettings, number>;

  constructor() {
    super('BrunoDB');
    this.version(1).stores({
      sessions: '++id, programmeId, date, level',
      incidents: '++id, date, relatedProgramme, severity',
      progress: '++id, &programmeId',
      settings: 'id',
    });
  }
}

export const db = new BrunoDB();

export async function exportData(): Promise<string> {
  const [sessions, incidents, progress, settings] = await Promise.all([
    db.sessions.toArray(),
    db.incidents.toArray(),
    db.progress.toArray(),
    db.settings.toArray(),
  ]);
  return JSON.stringify({ sessions, incidents, progress, settings, exportedAt: new Date().toISOString() }, null, 2);
}

export async function importData(json: string): Promise<void> {
  const data = JSON.parse(json);
  await db.transaction('rw', [db.sessions, db.incidents, db.progress, db.settings], async () => {
    await db.sessions.clear();
    await db.incidents.clear();
    await db.progress.clear();
    await db.settings.clear();
    if (data.sessions?.length) await db.sessions.bulkAdd(data.sessions);
    if (data.incidents?.length) await db.incidents.bulkAdd(data.incidents);
    if (data.progress?.length) await db.progress.bulkAdd(data.progress);
    if (data.settings?.length) await db.settings.bulkAdd(data.settings);
  });
}
