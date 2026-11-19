import type { H3Event } from 'h3'
import builtinImages from '../assets/builtin-images.json'
import { getContentKv } from './content-store'

/**
 * Media library: uploaded images live in Workers KV on Cloudflare and on disk
 * elsewhere. Built-in assets under `public/images` are described by a manifest
 * (Workers cannot list a filesystem).
 */

const KV_UPLOADS = 'uploads'
const KV_PREFIX = 'upload:'
const MAX_BYTES = 8 * 1024 * 1024

export interface MediaItem {
  url: string
  name: string
  size: number
  updatedAt: string
  source: 'uploads' | 'builtin'
}

interface UploadEntry {
  name: string
  size: number
  type: string
  uploadedAt: string
}

interface KvBinding {
  get(key: string, type?: 'text' | 'json'): Promise<unknown>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

const bytesToBase64 = (bytes: Uint8Array): string => {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

const base64ToBytes = (value: string): Uint8Array => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

const readIndex = async (kv: KvBinding): Promise<UploadEntry[]> => {
  return ((await kv.get(KV_UPLOADS, 'json')) as UploadEntry[] | null) ?? []
}

const writeIndex = async (kv: KvBinding, entries: UploadEntry[]) => {
  await kv.put(KV_UPLOADS, JSON.stringify(entries))
}

export const builtinMedia = (): MediaItem[] =>
  (builtinImages as Array<{ name: string; size: number }>).map((file) => ({
    url: `/images/${file.name}`,
    name: file.name,
    size: file.size ?? 0,
    updatedAt: '',
    source: 'builtin' as const,
  }))

export const listUploadsFor = async (event: H3Event): Promise<MediaItem[]> => {
  const kv = getContentKv(event) as KvBinding | null

  if (kv) {
    const entries = await readIndex(kv)
    return entries
      .slice()
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
      .map((entry) => ({
        url: `/uploads/${entry.name}`,
        name: entry.name,
        size: entry.size,
        updatedAt: entry.uploadedAt,
        source: 'uploads' as const,
      }))
  }

  return (await import('./media')).listUploadedMedia()
}

export const listMediaLibrary = async (event: H3Event): Promise<MediaItem[]> => [
  ...(await listUploadsFor(event)),
  ...builtinMedia(),
]

export const saveUploadedMedia = async (
  event: H3Event,
  file: { name: string; bytes: Uint8Array; type: string },
): Promise<MediaItem> => {
  const kv = getContentKv(event) as KvBinding | null

  if (!kv) {
    const uploads = await import('./uploads')
    const { writeFile } = await import('node:fs/promises')
    const { join } = await import('node:path')

    uploads.ensureUploadDir()
    await writeFile(join(uploads.UPLOAD_DIR, file.name), file.bytes)

    return {
      url: `/uploads/${file.name}`,
      name: file.name,
      size: file.bytes.length,
      updatedAt: new Date().toISOString(),
      source: 'uploads',
    }
  }

  const uploadedAt = new Date().toISOString()
  const entries = await readIndex(kv)

  await kv.put(`${KV_PREFIX}${file.name}`, bytesToBase64(file.bytes))
  await writeIndex(kv, [
    { name: file.name, size: file.bytes.length, type: file.type, uploadedAt },
    ...entries.filter((entry) => entry.name !== file.name),
  ])

  return {
    url: `/uploads/${file.name}`,
    name: file.name,
    size: file.bytes.length,
    updatedAt: uploadedAt,
    source: 'uploads',
  }
}

export const readUploadedMedia = async (
  event: H3Event,
  name: string,
): Promise<{ bytes: Uint8Array; type: string } | null> => {
  const kv = getContentKv(event) as KvBinding | null

  if (kv) {
    const entries = await readIndex(kv)
    const entry = entries.find((item) => item.name === name)
    if (!entry) return null

    const encoded = (await kv.get(`${KV_PREFIX}${name}`, 'text')) as string | null
    if (!encoded) return null

    return { bytes: base64ToBytes(encoded), type: entry.type }
  }

  const uploads = await import('./uploads')
  const { readFile } = await import('node:fs/promises')

  const path = uploads.resolveUploadFile(name)
  if (!path) return null

  return { bytes: new Uint8Array(await readFile(path)), type: uploads.uploadMime(path) }
}

export const deleteUploadedMedia = async (event: H3Event, name: string): Promise<boolean> => {
  const kv = getContentKv(event) as KvBinding | null

  if (kv) {
    const entries = await readIndex(kv)
    if (!entries.some((entry) => entry.name === name)) return false

    await kv.delete(`${KV_PREFIX}${name}`)
    await writeIndex(kv, entries.filter((entry) => entry.name !== name))
    return true
  }

  const uploads = await import('./uploads')
  const { unlink } = await import('node:fs/promises')

  const path = uploads.resolveUploadFile(name)
  if (!path) return false

  await unlink(path).catch(() => undefined)
  return true
}

export const uploadLimits = { maxBytes: MAX_BYTES }
