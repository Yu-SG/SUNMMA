import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { UPLOAD_DIR, MIME_BY_EXTENSION } from './uploads'

/**
 * Local-disk implementation of the uploads listing, used when the app runs on
 * Node (local dev or a Node host). On Cloudflare the KV implementation in
 * `media-store.ts` is used instead.
 */

const isImage = (name: string) => Boolean(MIME_BY_EXTENSION[name.slice(name.lastIndexOf('.')).toLowerCase()])

export const listUploadedMedia = async () => {
  try {
    const names = await readdir(UPLOAD_DIR)
    const files = await Promise.all(
      names.filter(isImage).map(async (name) => {
        const info = await stat(join(UPLOAD_DIR, name))
        return {
          url: `/uploads/${name}`,
          name,
          size: info.size,
          updatedAt: info.mtime.toISOString(),
          source: 'uploads' as const,
        }
      }),
    )

    return files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}
