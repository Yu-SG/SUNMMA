export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const items = await listMediaLibrary(event)
  const uploads = items.filter((item) => item.source === 'uploads').length

  return {
    items,
    counts: { uploads, builtin: items.length - uploads },
  }
})
