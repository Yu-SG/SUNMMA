import type { H3Event } from 'h3'
import { defaultContent, type SiteConfig } from '#shared/site'
import { platformBinding, rememberPlatformEnv } from './platform'

/**
 * Storage for the single content document.
 *
 * On Cloudflare Workers/Pages the document lives in Workers KV (binding
 * `CONTENT_KV`), because Workers have no writable disk and no `node:sqlite`.
 * Everywhere else (local dev, Node hosts) it falls back to the SQLite store in
 * `server/utils/db.ts`.
 */

const KV_CONTENT = 'content'
const KV_REVISIONS = 'revisions'
const MAX_REVISIONS = 20

export interface RevisionSummary {
  id: number
  created_at: string
}

export interface ContentMeta {
  updatedAt: string | null
  dbPath: string
}

interface KvBinding {
  get(key: string, type?: 'text' | 'json'): Promise<unknown>
  put(key: string, value: string): Promise<void>
}

interface KvEntry {
  data: SiteConfig
  updatedAt: string
}

interface KvRevision {
  id: number
  createdAt: string
  data: SiteConfig
}

/** Returns the KV binding when running on Cloudflare, otherwise null. */
export const getContentKv = (event?: H3Event | null): KvBinding | null => {
  rememberPlatformEnv(event)
  return platformBinding<KvBinding>('CONTENT_KV')
}

export const mergeContent = (value: unknown): SiteConfig => {
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

const readKvEntry = async (kv: KvBinding): Promise<KvEntry> => {
  const stored = (await kv.get(KV_CONTENT, 'json')) as KvEntry | null
  if (stored?.data) {
    return { data: mergeContent(stored.data), updatedAt: stored.updatedAt ?? new Date().toISOString() }
  }

  const seeded: KvEntry = { data: mergeContent(null), updatedAt: new Date().toISOString() }
  await kv.put(KV_CONTENT, JSON.stringify(seeded))
  return seeded
}

const readKvRevisions = async (kv: KvBinding): Promise<KvRevision[]> => {
  return ((await kv.get(KV_REVISIONS, 'json')) as KvRevision[] | null) ?? []
}

export const loadContent = async (event: H3Event): Promise<SiteConfig> => {
  const kv = getContentKv(event)
  if (!kv) {
    // On a Worker without the KV binding the SQLite fallback cannot work —
    // serve the built-in defaults instead of a 500 so the site still renders.
    try {
      return (await import('./db')).readContent()
    } catch {
      return mergeContent(null)
    }
  }
  return (await readKvEntry(kv)).data
}

export const loadMeta = async (event: H3Event): Promise<ContentMeta> => {
  const kv = getContentKv(event)
  if (!kv) {
    try {
      return (await import('./db')).readMeta()
    } catch {
      return { updatedAt: null, dbPath: '未配置存储（缺少 CONTENT_KV 绑定）' }
    }
  }

  const entry = await readKvEntry(kv)
  return { updatedAt: entry.updatedAt, dbPath: 'Cloudflare KV · CONTENT_KV' }
}

export const saveContent = async (event: H3Event, next: unknown): Promise<SiteConfig> => {
  const kv = getContentKv(event)
  if (!kv) {
    try {
      return (await import('./db')).writeContent(next)
    } catch {
      throw createError({
        statusCode: 503,
        statusMessage: '当前部署没有可写存储：请在 Cloudflare 绑定 CONTENT_KV，详见 README',
      })
    }
  }

  const data = mergeContent(next)
  const updatedAt = new Date().toISOString()
  const revisions = await readKvRevisions(kv)
  const id = (revisions[0]?.id ?? 0) + 1

  await kv.put(KV_CONTENT, JSON.stringify({ data, updatedAt } satisfies KvEntry))
  await kv.put(
    KV_REVISIONS,
    JSON.stringify([{ id, createdAt: updatedAt, data }, ...revisions].slice(0, MAX_REVISIONS)),
  )

  return data
}

export const listContentRevisions = async (event: H3Event): Promise<RevisionSummary[]> => {
  const kv = getContentKv(event)
  if (!kv) {
    try {
      return (await import('./db')).listRevisions()
    } catch {
      return []
    }
  }

  return (await readKvRevisions(kv)).map((revision) => ({ id: revision.id, created_at: revision.createdAt }))
}

export const restoreContentRevision = async (event: H3Event, id: number): Promise<SiteConfig | null> => {
  const kv = getContentKv(event)
  if (!kv) {
    try {
      return (await import('./db')).restoreRevision(id)
    } catch {
      throw createError({ statusCode: 503, statusMessage: '当前部署没有可写存储：请绑定 CONTENT_KV' })
    }
  }

  const revision = (await readKvRevisions(kv)).find((entry) => entry.id === id)
  if (!revision) return null

  return saveContent(event, revision.data)
}
