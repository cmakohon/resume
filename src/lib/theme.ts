import { useCallback, useEffect, useSyncExternalStore } from "react"
import { flushSync } from "react-dom"

export type Theme = "light" | "dark"

const STORAGE_KEY = "theme"
const DARK_QUERY = "(prefers-color-scheme: dark)"

/** Browser chrome color per theme. Keep in sync with --color-background and index.html. */
const THEME_COLOR: Record<Theme, string> = { light: "#faf9f6", dark: "#141412" }

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === "light" || value === "dark" ? value : null
  } catch {
    return null
  }
}

function systemTheme(): Theme {
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light"
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

const listeners = new Set<() => void>()

function apply(theme: Theme) {
  const root = document.documentElement
  // Drop transitions for one frame so every surface flips together.
  root.classList.add("theme-switching")
  root.dataset.theme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme])
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove("theme-switching"))
  })
  listeners.forEach((listener) => listener())
}

/**
 * How the switch plays. `reveal` wipes the new theme out in a circle from
 * `origin`, `fade` cross-fades the whole page, `instant` just flips.
 */
export interface ThemeSwitch {
  style: "reveal" | "fade" | "instant"
  origin?: { x: number; y: number }
  /** Seconds. */
  duration?: number
  /** CSS easing string. */
  easing?: string
}

/** Set the theme and remember the choice, which stops following the OS. */
export function setTheme(theme: Theme, how: ThemeSwitch = { style: "instant" }) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }

  if (how.style === "instant" || !("startViewTransition" in document)) {
    apply(theme)
    return
  }

  const root = document.documentElement
  const duration = (how.duration ?? 0.5) * 1000
  const easing = how.easing ?? "ease-out"
  // Tells index.css which default view-transition animation to switch off.
  root.dataset.themeSwitch = how.style

  // flushSync so React paints the new toggle icon before the browser
  // captures the new state.
  const transition = document.startViewTransition(() =>
    flushSync(() => apply(theme))
  )

  transition.ready
    .then(() => {
      if (how.style === "reveal") {
        const { x, y } = how.origin ?? {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        }
        // Far enough to reach the farthest corner of the viewport.
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        )
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          { duration, easing, pseudoElement: "::view-transition-new(root)" }
        )
      } else {
        root.animate(
          { opacity: [0, 1] },
          { duration, easing: "linear", pseudoElement: "::view-transition-new(root)" }
        )
      }
    })
    .catch(() => {
      // Skipped (tab hidden, another transition started): the theme already applied.
    })

  transition.finished.finally(() => {
    delete root.dataset.themeSwitch
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Current theme, plus a toggle. Follows the OS until the visitor picks one. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "light" as Theme)

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const onChange = () => {
      if (readStored() === null) apply(systemTheme())
    }
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  const toggle = useCallback(
    (how?: ThemeSwitch) => setTheme(getTheme() === "dark" ? "light" : "dark", how),
    []
  )

  return { theme, toggle }
}
