export default defineEventHandler((event) => {
  requireAdmin(event)
  return {
    content: readContent(),
    meta: readMeta(),
    revisions: listRevisions(),
  }
})
