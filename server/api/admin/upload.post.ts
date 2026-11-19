import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  MAX_UPLOAD_BYTES,
  UPLOAD_DIR,
  buildUploadName,
  ensureUploadDir,
  uploadExtension,
} from '~~/server/utils/uploads'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((part) => part.name === 'file' && part.data?.length)

  if (!file?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: '没有收到文件' })
  }

  const extension = uploadExtension(file.type || '')
  if (!extension) {
    throw createError({ statusCode: 415, statusMessage: '只支持 JPG、PNG、WebP、GIF、AVIF 图片' })
  }

  if (file.data.length > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 413, statusMessage: '图片不能超过 8MB' })
  }

  ensureUploadDir()

  const name = buildUploadName(extension)
  await writeFile(join(UPLOAD_DIR, name), file.data)

  return {
    url: `/uploads/${name}`,
    name,
    size: file.data.length,
  }
})
