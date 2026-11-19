/**
 * Admin studio appearance preferences: theme colour + dark mode.
 *
 * Stored in `localStorage` so the choice survives reloads, and applied before
 * the app paints (see the inline head script in `nuxt.config.ts`) to avoid a
 * white flash on dark mode.
 */
export interface StudioThemePrefs {
  primary: string
  dark: boolean
}

export const themePresets = [
  { name: '经典蓝', value: '#1976d2' },
  { name: '靛青', value: '#3f51b5' },
  { name: '青碧', value: '#00897b' },
  { name: '紫罗兰', value: '#7c4dff' },
  { name: '琥珀', value: '#ef6c00' },
  { name: '玫红', value: '#d81b60' },
  { name: '石墨', value: '#37474f' },
] as const

const STORAGE_KEY = 'studio:theme'
const DEFAULT_PREFS: StudioThemePrefs = { primary: '#1976d2', dark: false }

export const loadStudioTheme = (): StudioThemePrefs => {
  if (!import.meta.client) return { ...DEFAULT_PREFS }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<StudioThemePrefs>
    return {
      primary: typeof parsed.primary === 'string' && /^#[0-9a-f]{6}$/i.test(parsed.primary)
        ? parsed.primary
        : DEFAULT_PREFS.primary,
      dark: Boolean(parsed.dark),
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export const saveStudioTheme = (prefs: StudioThemePrefs) => {
  if (!import.meta.client) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    /* storage might be unavailable (private mode) — ignore */
  }
}

/** Paints the document background before Vue/Vuetify mount, so dark mode never flashes white. */
export const applyDocumentTheme = (prefs: StudioThemePrefs) => {
  if (!import.meta.client) return
  const root = document.documentElement
  root.dataset.studioTheme = prefs.dark ? 'dark' : 'light'
  root.style.backgroundColor = prefs.dark ? '#11161f' : ''
  document.body.style.backgroundColor = prefs.dark ? '#11161f' : ''
}

export const clearDocumentTheme = () => {
  if (!import.meta.client) return
  const root = document.documentElement
  delete root.dataset.studioTheme
  root.style.backgroundColor = ''
  document.body.style.backgroundColor = ''
}
