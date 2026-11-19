import { randomUUID } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { getContentKv } from '../utils/content-store'

/**
 * Public form submissions (contact + pharmacovigilance).
 *
 * The site runs on Cloudflare Workers in production and on Node in dev, so the
 * record is stored in Workers KV when the `CONTENT_KV` binding exists and in a
 * local JSONL file (`.data/forms.jsonl`) otherwise — mirroring content-store.
 */

const MAX_FIELDS = 24
const MAX_VALUE_LENGTH = 2000
const MAX_TOTAL_LENGTH = 12000

const REQUIRED_FIELDS: Record<string, string[]> = {
  contact: ['name', 'phone', 'email', 'message'],
  pharmacovigilance: ['name', 'phone', 'drugName', 'reaction'],
}

const FIELD_NAME = /^[a-zA-Z][a-zA-Z0-9_]{0,31}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const badRequest = (statusMessage: string) =>
  createError({ statusCode: 400, statusMessage })

const formsFilePath = () => resolve(process.env.FORMS_DIR || resolve(process.cwd(), '.data'), 'forms.jsonl')

export default defineEventHandler(async (event) => {
  const length = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (length > 64 * 1024) {
    throw createError({ statusCode: 413, statusMessage: '提交内容过大，请精简后重试。' })
  }

  const body = await readBody<{ type?: unknown; fields?: unknown }>(event)
  if (!body || typeof body !== 'object') throw badRequest('请求内容格式不正确。')

  const type = typeof body.type === 'string' ? body.type.trim() : ''
  if (!type || !Object.hasOwn(REQUIRED_FIELDS, type)) {
    throw badRequest('未知的表单类型。')
  }

  const rawFields = body.fields
  if (!rawFields || typeof rawFields !== 'object' || Array.isArray(rawFields)) {
    throw badRequest('表单内容格式不正确。')
  }

  const entries = Object.entries(rawFields as Record<string, unknown>)
  if (entries.length === 0) throw badRequest('请填写表单内容。')
  if (entries.length > MAX_FIELDS) throw badRequest('表单字段过多。')

  const fields: Record<string, string> = {}
  let totalLength = 0

  for (const [key, value] of entries) {
    if (!FIELD_NAME.test(key)) throw badRequest('表单字段名不合法。')
    if (typeof value !== 'string') throw badRequest(`字段 ${key} 的格式不正确。`)

    const trimmed = value.trim()
    if (trimmed.length > MAX_VALUE_LENGTH) {
      throw badRequest(`字段 ${key} 超出最大长度（${MAX_VALUE_LENGTH} 字）。`)
    }

    totalLength += trimmed.length
    if (totalLength > MAX_TOTAL_LENGTH) throw badRequest('提交内容过长，请精简后重试。')
    if (trimmed) fields[key] = trimmed
  }

  for (const required of REQUIRED_FIELDS[type]!) {
    if (!fields[required]) {
      throw badRequest(`请填写必填项：${required}`)
    }
  }

  if (type === 'contact') {
    if (!EMAIL.test(fields.email ?? '')) throw badRequest('请输入有效的电子邮箱。')
  }

  if (fields.phone) {
    const digits = fields.phone.replace(/\D/g, '')
    if (digits.length < 6 || digits.length > 20) throw badRequest('请输入有效的联系电话。')
  }

  const record = {
    id: `${Date.now()}-${randomUUID().slice(0, 8)}`,
    type,
    fields,
    createdAt: new Date().toISOString(),
  }

  try {
    const kv = getContentKv(event)
    if (kv) {
      await kv.put(`forms:${Date.now()}`, JSON.stringify(record))
    } else {
      // Imported lazily: Cloudflare Workers have no writable filesystem.
      const { appendFile, mkdir } = await import('node:fs/promises')
      const file = formsFilePath()
      await mkdir(dirname(file), { recursive: true })
      await appendFile(file, `${JSON.stringify(record)}\n`, 'utf8')
    }
  } catch (error) {
    console.error('[forms] 无法写入表单存储', error)
    throw createError({
      statusCode: 503,
      statusMessage: '表单暂时无法提交，请稍后重试或直接致电我们。',
    })
  }

  return { ok: true }
})
