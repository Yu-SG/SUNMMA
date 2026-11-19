import type { H3Event } from 'h3'

/**
 * Cloudflare bindings live on `event.context.cloudflare.env`, but Nitro's
 * internal `$fetch` (SSR data calls) creates a fresh event without that
 * context. Remember the last real environment so nested requests can still
 * reach the KV namespace.
 */
let remembered: Record<string, unknown> | null = null

export const rememberPlatformEnv = (event?: H3Event | null) => {
  const env = (event?.context as { cloudflare?: { env?: Record<string, unknown> } } | undefined)?.cloudflare?.env
  if (env) remembered = env
}

export const platformEnv = (): Record<string, unknown> | null => {
  return remembered ?? (globalThis as { __CF_ENV?: Record<string, unknown> }).__CF_ENV ?? null
}

export const platformBinding = <T>(name: string): T | null => {
  const env = platformEnv()
  const binding = env?.[name]
  return (binding as T | undefined) ?? null
}
