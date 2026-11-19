/**
 * Captures the Cloudflare environment on the first real request so nested
 * internal requests (SSR `$fetch` to `/api/*`) can still access KV bindings.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    rememberPlatformEnv(event)
  })
})
