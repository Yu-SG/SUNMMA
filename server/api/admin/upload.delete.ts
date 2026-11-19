import { unlink } from 'node:fs/promises'
import { resolveUploadFile } from '~~/server/utils/uploads'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<{ url?: string }>(event).catch(() => null)
  const url = typeof body?.url === 'string' ? body.url : ''

  if (!url.startsWith('/uploads/')) {
    // Built-in assets under /images are part of the repository — never touch them.
    return { deleted: false, reason: '只能删除后台上传的图片' }
  }

  const path = resolveUploadFile(url)
  if (!path) return { deleted: false, reason: '文件不存在' }

  await unlink(path).catch(() => undefined)
  return { deleted: true }
})
