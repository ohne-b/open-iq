import { openDB } from 'idb';
import type { Session } from './domain';
import { parseSession } from './session';

const database = () =>
  openDB('open-iq', 1, {
    upgrade(db) {
      db.createObjectStore('sessions', { keyPath: 'id' });
    },
  });
let queue = Promise.resolve();

export async function loadSessions(): Promise<Session[]> {
  const db = await database();
  try {
    const records: unknown[] = await db.getAll('sessions');
    return records.map(parseSession).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } finally {
    db.close();
  }
}

export function saveSession(session: Session) {
  const next = queue
    .catch(() => {})
    .then(async () => {
      const db = await database();
      try {
        await db.put('sessions', session);
      } finally {
        db.close();
      }
    });
  queue = next;
  return next;
}

export async function deleteSession(id: string) {
  await queue.catch(() => {});
  const db = await database();
  try {
    await db.delete('sessions', id);
  } finally {
    db.close();
  }
}

export function downloadSession(session: Session) {
  const blob = new Blob([JSON.stringify(session, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `open-iq-${session.startedAt.slice(0, 10)}-${session.id.slice(0, 8)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
