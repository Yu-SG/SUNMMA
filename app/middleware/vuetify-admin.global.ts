import { ensureVuetify } from '~/utils/vuetify'
import { applyDocumentTheme, clearDocumentTheme, loadStudioTheme } from '~/utils/studio-theme'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  if (!to.path.startsWith('/admin')) {
    clearDocumentTheme()
    return
  }

  // Paint the document before the first render so dark mode never flashes white.
  applyDocumentTheme(loadStudioTheme())
  await ensureVuetify()
})
