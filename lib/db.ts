import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:teardowns.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let ready = false;

async function ensureReady() {
  if (ready) return;
  await client.execute(`
    CREATE TABLE IF NOT EXISTS teardowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      filename TEXT NOT NULL,
      pdf_data TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  ready = true;
}

export interface Teardown {
  id: number;
  title: string;
  description: string;
  date: string;
  filename: string;
  created_at: string;
}

export async function getAllTeardowns(): Promise<Teardown[]> {
  await ensureReady();
  const result = await client.execute(
    'SELECT id, title, description, date, filename, created_at FROM teardowns ORDER BY date DESC'
  );
  return result.rows as unknown as Teardown[];
}

export async function getTeardownById(id: number): Promise<Teardown | undefined> {
  await ensureReady();
  const result = await client.execute({
    sql: 'SELECT id, title, description, date, filename, created_at FROM teardowns WHERE id = ?',
    args: [id],
  });
  return result.rows[0] as unknown as Teardown | undefined;
}

export async function getPdfData(id: number): Promise<string | undefined> {
  await ensureReady();
  const result = await client.execute({
    sql: 'SELECT pdf_data FROM teardowns WHERE id = ?',
    args: [id],
  });
  return result.rows[0]?.pdf_data as string | undefined;
}

export async function deleteTeardown(id: number): Promise<void> {
  await ensureReady();
  await client.execute({ sql: 'DELETE FROM teardowns WHERE id = ?', args: [id] });
}

export async function createTeardown(data: {
  title: string;
  description: string;
  date: string;
  filename: string;
  pdfData: string;
}): Promise<Teardown> {
  await ensureReady();
  const result = await client.execute({
    sql: 'INSERT INTO teardowns (title, description, date, filename, pdf_data) VALUES (?, ?, ?, ?, ?)',
    args: [data.title, data.description, data.date, data.filename, data.pdfData],
  });
  const inserted = await getTeardownById(Number(result.lastInsertRowid));
  return inserted!;
}
