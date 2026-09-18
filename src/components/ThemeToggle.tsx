import { AnimatePresence, motion } from "motion/react"
import type { MouseEvent } from "react"
import {
  useMotionUITheme,
  useMotionUITransition,
} from "@/components/motion-ui/ui-theme"
import { useTheme } from "@/lib/theme"

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="size-4">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-4">
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
    </svg>
  )
}

/** Sun or moon, showing the theme you'd switch to. Icons turn over on swap, and the new theme spreads out from the button. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const uiTheme = useMotionUITheme()
  const snap = useMotionUITransition("snap")
  const still = uiTheme.motionMode !== "full"
  const dark = theme === "dark"

  // The new theme spreads out from the button on the site's gentle curve.
  // Calm motion gets a plain cross-fade, and motion off just flips.
  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const { duration, ease } = uiTheme.transitions.gentle
    const rect = event.currentTarget.getBoundingClientRect()
    toggle({
      style:
        uiTheme.motionMode === "full"
          ? "reveal"
          : uiTheme.motionMode === "calm"
            ? "fade"
            : "instant",
      origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      duration: uiTheme.motionMode === "full" ? duration : duration / 2,
      easing: `cubic-bezier(${ease.join(", ")})`,
    })
  }

  // Literal transform strings so Motion can hand the turn to the compositor.
  const hidden = still
    ? { opacity: 0 }
    : { opacity: 0, transform: "rotate(-90deg) scale(0.6)" }
  const shown = { opacity: 1, transform: "rotate(0deg) scale(1)" }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={dark}
      className="-m-2 grid size-8 cursor-pointer place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          className="col-start-1 row-start-1 grid place-items-center"
          initial={hidden}
          animate={shown}
          exit={still ? { opacity: 0 } : { opacity: 0, transform: "rotate(90deg) scale(0.6)" }}
          transition={uiTheme.motionMode === "off" ? { duration: 0 } : snap}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
