export default defineEventHandler(async (event) => {
  requireAdmin(event)

  return {
    content: await loadContent(event),
    meta: await loadMeta(event),
    revisions: await listContentRevisions(event),
  }
})
