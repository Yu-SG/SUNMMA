export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<{ content?: unknown }>(event)
  if (!body || typeof body.content !== 'object' || body.content === null) {
    throw createError({ statusCode: 400, statusMessage: '内容格式不正确' })
  }

  const content = await saveContent(event, body.content)

  return {
    content,
    meta: await loadMeta(event),
    revisions: await listContentRevisions(event),
  }
})
