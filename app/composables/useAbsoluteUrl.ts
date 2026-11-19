/**
 * 生成绝对地址（canonical / og:image / JSON-LD 都要绝对 URL）。
 */
export const useAbsoluteUrl = () => {
  const config = useRuntimeConfig()
  const base = String(config.public.siteUrl || '').replace(/\/+$/, '')

  return (path?: string | null) => {
    if (!path) return base
    if (/^https?:\/\//i.test(path)) return path
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`
  }
}
