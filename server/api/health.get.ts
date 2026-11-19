export default defineEventHandler((event) => {
  const env = platformEnv()
  const kv = Boolean(env?.CONTENT_KV)

  return {
    ok: true,
    storage: kv ? 'cloudflare-kv' : 'sqlite',
    // Only booleans — never expose secrets.
    adminPasswordFromEnv: Boolean(process.env.ADMIN_PASSWORD),
    adminSecretFromEnv: Boolean(process.env.ADMIN_SECRET),
    node: process.version,
    commit: process.env.CF_PAGES_COMMIT_SHA ?? null,
    branch: process.env.CF_PAGES_BRANCH ?? null,
    time: new Date().toISOString(),
  }
})
