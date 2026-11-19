export default defineEventHandler(async (event) => {
  requireAdmin(event)
  return { revisions: await listContentRevisions(event) }
})
