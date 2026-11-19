import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defaultContent, type SiteConfig } from '#shared/site'

const DB_PATH = process.env.CONTENT_DB_PATH || resolve(process.cwd(), '.data/content.db')

let database: DatabaseSync | null = null

export const getDb = (): DatabaseSync => {
  if (database) return database

  mkdirSync(dirname(DB_PATH), { recursive: true })
  database = new DatabaseSync(DB_PATH)
  database.exec('PRAGMA journal_mode = WAL')
  database.exec(`
    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
  database.exec(`
    CREATE TABLE IF NOT EXISTS content_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `)

  const row = database.prepare('SELECT data FROM content WHERE id = 1').get() as { data?: string } | undefined
  if (!row) {
    database
      .prepare('INSERT INTO content (id, data, updated_at) VALUES (1, ?, ?)')
      .run(JSON.stringify(defaultContent), new Date().toISOString())
  }

  return database
}

const mergeDefaults = (value: unknown): SiteConfig => {
  const base = JSON.parse(JSON.stringify(defaultContent)) as SiteConfig
  if (!value || typeof value !== 'object') return base

  const merge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
    for (const key of Object.keys(source)) {
      const incoming = source[key]
      const current = target[key]
      if (Array.isArray(incoming)) {
        target[key] = incoming
      } else if (incoming && typeof incoming === 'object') {
        if (current && typeof current === 'object' && !Array.isArray(current)) {
          merge(current as Record<string, unknown>, incoming as Record<string, unknown>)
        } else {
          target[key] = incoming
        }
      } else if (incoming !== undefined) {
        target[key] = incoming
      }
    }
  }

  merge(base as unknown as Record<string, unknown>, value as Record<string, unknown>)
  return base
}

export const readContent = (): SiteConfig => {
  const db = getDb()
  const row = db.prepare('SELECT data FROM content WHERE id = 1').get() as { data?: string } | undefined
  if (!row?.data) return mergeDefaults(null)
  try {
    return mergeDefaults(JSON.parse(row.data))
  } catch {
    return mergeDefaults(null)
  }
}

export const writeContent = (next: unknown): SiteConfig => {
  const db = getDb()
  const merged = mergeDefaults(next)
  const payload = JSON.stringify(merged)
  const now = new Date().toISOString()

  db.prepare('UPDATE content SET data = ?, updated_at = ? WHERE id = 1').run(payload, now)
  db.prepare('INSERT INTO content_revisions (data, created_at) VALUES (?, ?)').run(payload, now)
  db.exec(
    'DELETE FROM content_revisions WHERE id NOT IN (SELECT id FROM content_revisions ORDER BY id DESC LIMIT 20)',
  )

  return merged
}

export const readMeta = () => {
  const db = getDb()
  const row = db.prepare('SELECT updated_at FROM content WHERE id = 1').get() as
    | { updated_at?: string }
    | undefined
  return { updatedAt: row?.updated_at ?? null, dbPath: DB_PATH }
}

export const listRevisions = () => {
  const db = getDb()
  return db
    .prepare('SELECT id, created_at FROM content_revisions ORDER BY id DESC LIMIT 20')
    .all() as Array<{ id: number; created_at: string }>
}

export const restoreRevision = (id: number): SiteConfig | null => {
  const db = getDb()
  const row = db.prepare('SELECT data FROM content_revisions WHERE id = ?').get(id) as
    | { data?: string }
    | undefined
  if (!row?.data) return null
  return writeContent(JSON.parse(row.data))
}
