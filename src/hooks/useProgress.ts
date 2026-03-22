import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import type { UserProgress } from '../types';

export function useProgress(programmeId?: string) {
  const allProgress = useLiveQuery(() => db.progress.toArray(), []);

  const programmeProgress = useLiveQuery(
    () => (programmeId ? db.progress.where('programmeId').equals(programmeId).first() : undefined),
    [programmeId],
  );

  async function initProgress(progId: string): Promise<UserProgress> {
    const existing = await db.progress.where('programmeId').equals(progId).first();
    if (existing) return existing;
    const now = new Date().toISOString();
    const newProgress: UserProgress = {
      programmeId: progId,
      currentLevel: 1,
      completedLevels: [],
      startedAt: now,
      updatedAt: now,
    };
    const id = await db.progress.add(newProgress);
    return { ...newProgress, id };
  }

  async function advanceLevel(progId: string, currentLevel: number) {
    const prog = await db.progress.where('programmeId').equals(progId).first();
    if (!prog?.id) return;
    const completed = [...new Set([...(prog.completedLevels || []), currentLevel])];
    await db.progress.update(prog.id, {
      currentLevel: currentLevel + 1,
      completedLevels: completed,
      updatedAt: new Date().toISOString(),
    });
  }

  async function regressLevel(progId: string, currentLevel: number) {
    const prog = await db.progress.where('programmeId').equals(progId).first();
    if (!prog?.id) return;
    const newLevel = Math.max(1, currentLevel - 1);
    await db.progress.update(prog.id, {
      currentLevel: newLevel,
      updatedAt: new Date().toISOString(),
    });
  }

  return { allProgress, programmeProgress, initProgress, advanceLevel, regressLevel };
}
