export default defineEventHandler((event) => {
  requireAdmin(event)
  return { revisions: listRevisions() }
})
