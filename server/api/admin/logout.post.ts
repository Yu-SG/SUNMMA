export default defineEventHandler((event) => {
  endSession(event)
  return { authenticated: false }
})
