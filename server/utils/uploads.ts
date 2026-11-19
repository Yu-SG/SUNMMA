import { existsSync, mkdirSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

export const UPLOAD_DIR = process.env.UPLOAD_DIR || resolve(process.cwd(), '.data/uploads')

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
}

export const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

export const ensureUploadDir = () => {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

export const buildUploadName = (extension: string) => {
  const stamp = Date.now().toString(36)
  const random = Math.random().toString(36).slice(2, 8)
  return `${stamp}-${random}${extension}`
}

/** Resolves a `/uploads/<name>` URL to a safe absolute path inside UPLOAD_DIR. */
export const resolveUploadFile = (urlOrName: string): string | null => {
  const raw = urlOrName.startsWith('/uploads/') ? urlOrName.slice('/uploads/'.length) : urlOrName
  const name = basename(raw)

  if (!name || name !== raw || !/^[a-z0-9][a-z0-9._-]*$/i.test(name)) return null

  const path = join(UPLOAD_DIR, name)
  return path.startsWith(UPLOAD_DIR) && existsSync(path) ? path : null
}

export const isUploadedImage = (value: string) => value.startsWith('/uploads/')

export const uploadExtension = (type: string) => ALLOWED_IMAGE_TYPES[type.toLowerCase()] ?? null

export const uploadMime = (path: string) => MIME_BY_EXTENSION[extname(path).toLowerCase()] ?? 'application/octet-stream'
