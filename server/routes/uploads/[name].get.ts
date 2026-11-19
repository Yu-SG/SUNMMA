import { readFile, stat } from 'node:fs/promises'
import { resolveUploadFile, uploadMime } from '~~/server/utils/uploads'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name') ?? ''
  const path = resolveUploadFile(name)

  if (!path) {
    throw createError({ statusCode: 404, statusMessage: '图片不存在' })
  }

  const info = await stat(path)

  setResponseHeader(event, 'content-type', uploadMime(path))
  setResponseHeader(event, 'content-length', info.size)
  setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable')

  return await readFile(path)
})
