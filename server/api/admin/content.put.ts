export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<{ content?: unknown }>(event)
  if (!body || typeof body.content !== 'object' || body.content === null) {
    throw createError({ statusCode: 400, statusMessage: '内容格式不正确' })
  }

  const content = writeContent(body.content)
  return { content, meta: readMeta(), revisions: listRevisions() }
})
