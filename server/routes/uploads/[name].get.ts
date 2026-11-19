import { readUploadedMedia } from '~~/server/utils/media-store'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  const file = await readUploadedMedia(event, name)

  if (!file) {
    throw createError({ statusCode: 404, statusMessage: '图片不存在' })
  }

  setResponseHeader(event, 'content-type', file.type || 'application/octet-stream')
  setResponseHeader(event, 'content-length', file.bytes.length)
  setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable')

  return file.bytes
})
