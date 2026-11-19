export default defineEventHandler(async (event) => {
  return {
    authenticated: isAuthenticated(event),
    meta: await loadMeta(event),
  }
})
