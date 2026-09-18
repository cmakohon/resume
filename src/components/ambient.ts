import { useInView } from "motion/react"
import type { RefObject } from "react"
import { useMotionUITheme } from "@/components/motion-ui/ui-theme"

/**
 * Gate for the CSS ambient loops in index.css. Spread the result onto the
 * element that `ref` points at: loops inside it run only in full motion mode
 * and pause while it is off screen. Calm and still modes get no attribute, so
 * the loops never start and everything renders as a static frame.
 */
export function useAmbient(ref: RefObject<Element | null>) {
  const theme = useMotionUITheme()
  const inView = useInView(ref, { margin: "100px" })

  if (theme.motionMode !== "full") return {}
  return { "data-ambient": inView ? "running" : "paused" }
}
