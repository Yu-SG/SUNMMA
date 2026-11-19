import { buildUploadName, uploadExtension } from '~~/server/utils/uploads'
import { saveUploadedMedia } from '~~/server/utils/media-store'

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((part) => part.name === 'file' && part.data?.length)

  if (!file?.data?.length) {
    throw createError({ statusCode: 400, statusMessage: '没有收到文件' })
  }

  const type = file.type || ''
  const extension = uploadExtension(type)
  if (!extension) {
    throw createError({ statusCode: 415, statusMessage: '只支持 JPG、PNG、WebP、GIF、AVIF 图片' })
  }

  if (file.data.length > MAX_UPLOAD_BYTES) {
    throw createError({ statusCode: 413, statusMessage: '图片不能超过 8MB' })
  }

  const saved = await saveUploadedMedia(event, {
    name: buildUploadName(extension),
    bytes: new Uint8Array(file.data),
    type,
  })

  return { url: saved.url, name: saved.name, size: saved.size }
})
