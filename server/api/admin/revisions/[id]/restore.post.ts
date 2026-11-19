export default defineEventHandler((event) => {
  requireAdmin(event)

  const id = Number(event.context.params?.id)
  if (!Number.isFinite(id)) {
    throw createError({ statusCode: 400, statusMessage: '版本号不正确' })
  }

  const restored = restoreRevision(id)
  if (!restored) {
    throw createError({ statusCode: 404, statusMessage: '找不到该版本' })
  }

  return { content: restored, meta: readMeta(), revisions: listRevisions() }
})
