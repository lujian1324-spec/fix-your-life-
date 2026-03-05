import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface DailyRecord {
  id?: number;
  day: number;
  date: string;
  tasks: { text: string; completed: boolean; expReward: number }[];
  statsSnapshot: {
    identity: number;
    clarity: number;
    focus: number;
    execution: number;
    creativity: number;
    health: number;
    wealth: number;
    influence: number;
  };
}

interface LifeOSDB extends DBSchema {
  history: {
    key: number;
    value: DailyRecord;
    indexes: { 'by-day': number };
  };
}

let dbPromise: Promise<IDBPDatabase<LifeOSDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<LifeOSDB>('life-os-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('history', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-day', 'day');
      },
    });
  }
  return dbPromise;
}

export async function addDailyRecord(record: Omit<DailyRecord, 'id'>) {
  const db = await getDB();
  return db.add('history', record);
}

export async function getHistory() {
  const db = await getDB();
  return db.getAllFromIndex('history', 'by-day');
}
