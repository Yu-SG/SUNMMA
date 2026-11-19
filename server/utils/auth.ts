import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const COOKIE_NAME = 'admin_session'
const SESSION_TTL = 1000 * 60 * 60 * 8

const secret = () => process.env.ADMIN_SECRET || 'dsh-dev-admin-secret'
const password = () => process.env.ADMIN_PASSWORD || 'admin123'

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('hex')

export const checkPassword = (input: unknown) => {
  if (typeof input !== 'string' || !input) return false
  const expected = Buffer.from(password())
  const actual = Buffer.from(input)
  if (expected.length !== actual.length) return false
  return timingSafeEqual(expected, actual)
}

const createToken = () => {
  const expires = Date.now() + SESSION_TTL
  return `${expires}.${sign(String(expires))}`
}

export const isValidToken = (token?: string | null) => {
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature) return false
  if (Number(expires) < Date.now()) return false
  const expected = sign(expires)
  if (expected.length !== signature.length) return false
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

export const startSession = (event: H3Event) => {
  // Cloudflare / 反向代理下 NODE_ENV 与协议都不可靠，
  // 直接看本次请求是不是 HTTPS，避免 secure cookie 在 http 下被丢弃。
  const protocol = getRequestProtocol(event) || ''
  const secure = protocol === 'https' || getHeader(event, 'x-forwarded-proto') === 'https'

  setCookie(event, COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL / 1000,
    secure,
  })
}

export const endSession = (event: H3Event) => {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

export const isAuthenticated = (event: H3Event) => isValidToken(getCookie(event, COOKIE_NAME))

export const requireAdmin = (event: H3Event) => {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: '未登录或登录已过期' })
  }
}
