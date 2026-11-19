export default defineNuxtPlugin(() => {
  const root = document.documentElement
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  root.classList.add('js-reveal')

  let observer: IntersectionObserver | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  const createObserver = () => {
    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer?.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
    )
    return observer
  }

  /**
   * Observing is cheap and idempotent, but the old version rebuilt the whole
   * observer on every DOM mutation — which fired constantly while scrolling
   * (the header and anchor nav toggle classes), causing 20–45 ms main-thread
   * stalls. Now we only look for elements that still need to be revealed.
   */
  const collect = () => {
    const pending = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')
    if (!pending.length) return

    const instance = createObserver()
    pending.forEach((el) => instance.observe(el))
  }

  const schedule = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(collect, 80)
  }

  const start = () => {
    requestAnimationFrame(() => requestAnimationFrame(schedule))
  }

  start()

  const nuxtApp = useNuxtApp()
  nuxtApp.hook('page:finish', start)

  // Late-mounted content (hydration of async sections) — a single pass after
  // the page settles instead of a document-wide MutationObserver.
  nuxtApp.hook('page:finish', () => {
    setTimeout(collect, 400)
  })
})
