import { loadStudioTheme, type StudioThemePrefs } from './studio-theme'

/**
 * Lazy Vuetify bootstrap for the admin studio.
 *
 * Loaded by `middleware/vuetify-admin.global` right before an /admin route
 * renders, so the public site never downloads Vuetify's runtime or stylesheet.
 *
 * Vuetify 4 only registers the components passed to `createVuetify`, so the
 * full component set is imported here (lazily, admin-only).
 */
let pending: Promise<void> | null = null
let current: { theme: any } | null = null

const createStudio = async (prefs: StudioThemePrefs) => {
  const [vuetifyModule, mdiModule, components, directives] = await Promise.all([
    import('vuetify'),
    import('vuetify/iconsets/mdi'),
    import('vuetify/components'),
    import('vuetify/directives'),
  ])

  const { createVuetify } = vuetifyModule
  const { aliases, mdi } = mdiModule

  return createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: prefs.dark ? 'studioDark' : 'studio',
      themes: {
        studio: {
          dark: false,
          colors: {
            background: '#f2f3f7',
            surface: '#ffffff',
            'surface-variant': '#eef1f6',
            primary: prefs.primary,
            'primary-darken-1': '#0d47a1',
            secondary: '#5c6bc0',
            accent: '#00bcd4',
            error: '#e53935',
            info: '#2196f3',
            success: '#2e7d32',
            warning: '#f9a825',
            'on-surface-variant': '#5b6472',
          },
        },
        studioDark: {
          dark: true,
          colors: {
            background: '#11161f',
            surface: '#1a2230',
            'surface-variant': '#222c3c',
            primary: prefs.primary,
            'primary-darken-1': '#0d47a1',
            secondary: '#7c8bd8',
            accent: '#26c6da',
            error: '#ef5350',
            info: '#42a5f5',
            success: '#66bb6a',
            warning: '#ffca28',
            'on-surface-variant': '#aab6c8',
          },
        },
      },
    },
    defaults: {
      VBtn: { rounded: 'lg', elevation: 0, height: 40 },
      VTextField: {
        variant: 'filled',
        density: 'comfortable',
        rounded: 'lg',
        bgColor: 'surface-variant',
        color: 'primary',
      },
      VTextarea: {
        variant: 'filled',
        density: 'comfortable',
        rounded: 'lg',
        bgColor: 'surface-variant',
        color: 'primary',
      },
      VSelect: {
        variant: 'filled',
        density: 'comfortable',
        rounded: 'lg',
        bgColor: 'surface-variant',
        color: 'primary',
      },
      VAutocomplete: {
        variant: 'filled',
        density: 'comfortable',
        rounded: 'lg',
        bgColor: 'surface-variant',
        color: 'primary',
      },
      VCard: { rounded: 'xl', elevation: 0 },
      VChip: { rounded: 'lg' },
      VList: { rounded: 'lg' },
    },
  })
}

export const ensureVuetify = async (): Promise<void> => {
  const app = useNuxtApp().vueApp

  // Checking the app registry keeps this idempotent per app instance and also
  // survives Vite HMR module reloads.
  if (app.component('VBtn')) return
  if (pending) return pending

  pending = (async () => {
    const prefs = loadStudioTheme()

    await import('vuetify/styles')
    await import('@mdi/font/css/materialdesignicons.css')

    const vuetify = await createStudio(prefs)
    current = vuetify as { theme: any }
    app.use(vuetify)
  })()

  try {
    await pending
  } finally {
    pending = null
  }
}

/** Applies studio preferences to the live Vuetify instance. */
export const applyStudioTheme = (prefs: StudioThemePrefs) => {
  if (!current?.theme) return

  const themes = current.theme.themes.value as Record<string, { colors: Record<string, string> }>
  for (const key of Object.keys(themes)) {
    if (themes[key]?.colors) themes[key].colors.primary = prefs.primary
  }
  const target = prefs.dark ? 'studioDark' : 'studio'
  if (typeof current.theme.change === 'function') {
    current.theme.change(target)
  } else {
    current.theme.global.name.value = target
  }
}
