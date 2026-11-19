import { readdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { UPLOAD_DIR, MIME_BY_EXTENSION } from './uploads'

export interface MediaItem {
  url: string
  name: string
  size: number
  updatedAt: string
  source: 'uploads' | 'builtin'
}

const BUILTIN_DIRS = [
  resolve(process.cwd(), 'public/images'),
  resolve(process.cwd(), '.output/public/images'),
]

const isImage = (name: string) => Boolean(MIME_BY_EXTENSION[name.slice(name.lastIndexOf('.')).toLowerCase()])

const readDir = async (dir: string): Promise<Array<{ name: string; size: number; mtime: Date }>> => {
  try {
    const names = await readdir(dir)
    const files = await Promise.all(
      names.filter(isImage).map(async (name) => {
        const info = await stat(join(dir, name))
        return { name, size: info.size, mtime: info.mtime }
      }),
    )
    return files
  } catch {
    return []
  }
}

export const listUploadedMedia = async (): Promise<MediaItem[]> => {
  const files = await readDir(UPLOAD_DIR)
  return files
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    .map((file) => ({
      url: `/uploads/${file.name}`,
      name: file.name,
      size: file.size,
      updatedAt: file.mtime.toISOString(),
      source: 'uploads' as const,
    }))
}

export const listBuiltinMedia = async (): Promise<MediaItem[]> => {
  const seen = new Map<string, MediaItem>()

  for (const dir of BUILTIN_DIRS) {
    const files = await readDir(dir)
    for (const file of files) {
      const url = `/images/${file.name}`
      if (seen.has(url)) continue
      seen.set(url, {
        url,
        name: file.name,
        size: file.size,
        updatedAt: file.mtime.toISOString(),
        source: 'builtin',
      })
    }
  }

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export const listMedia = async (): Promise<MediaItem[]> => [
  ...(await listUploadedMedia()),
  ...(await listBuiltinMedia()),
]
