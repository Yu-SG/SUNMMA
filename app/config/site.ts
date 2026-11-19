import { reactive } from 'vue'
import { defaultContent, type SiteConfig } from '#shared/site'

export * from '#shared/site'

/**
 * Live site content.
 *
 * The site is a single-document CMS: Nitro owns the SQLite database and exposes
 * the document through `/api/content`. `plugins/content.ts` hydrates this store
 * once at startup (server side before rendering, client side after hydration),
 * so every component keeps reading `siteConfig.*` as a plain object.
 */
export const siteConfig: SiteConfig = reactive(defaultContent)

type Plain = Record<string, unknown> | unknown[]

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Replaces the contents of `target` in place, so every component that already
 * captured a reference to `siteConfig` (or one of its branches) sees the update.
 */
export const hydrateSiteConfig = (next: unknown) => {
  if (!isPlainObject(next)) return

  const assign = (target: Record<string, unknown>, source: Record<string, unknown>) => {
    for (const key of Object.keys(target)) {
      if (!(key in source)) continue
      const current = target[key]
      const incoming = source[key]

      if (Array.isArray(current) && Array.isArray(incoming)) {
        current.splice(0, current.length, ...incoming)
      } else if (isPlainObject(current) && isPlainObject(incoming)) {
        assign(current, incoming)
      } else if (incoming !== undefined) {
        target[key] = incoming as never
      }
    }
  }

  assign(siteConfig as unknown as Record<string, unknown>, next)
}
