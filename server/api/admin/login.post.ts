export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event)

  if (!checkPassword(body?.password)) {
    throw createError({ statusCode: 401, statusMessage: '密码不正确' })
  }

  startSession(event)
  return { authenticated: true }
})
