import { deleteUploadedMedia } from '~~/server/utils/media-store'

/**
 * Delete an uploaded image: `DELETE /api/admin/upload?url=/uploads/xxx.jpg`
 *
 * The URL travels as a query parameter (not a JSON body) because reading a
 * request body on Cloudflare Workers for DELETE requests is unreliable.
 */
export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const url = typeof query.url === 'string' ? query.url : ''

  if (!url.startsWith('/uploads/')) {
    // Built-in assets under /images are part of the repository — never touch them.
    return { deleted: false, reason: '只能删除后台上传的图片' }
  }

  const deleted = await deleteUploadedMedia(event, url.slice('/uploads/'.length))
  return deleted ? { deleted: true } : { deleted: false, reason: '文件不存在' }
})
