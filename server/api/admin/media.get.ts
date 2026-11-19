export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const [uploads, builtin] = await Promise.all([listUploadedMedia(), listBuiltinMedia()])

  return {
    items: [...uploads, ...builtin],
    counts: { uploads: uploads.length, builtin: builtin.length },
  }
})
