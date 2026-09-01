import type { Variants } from "motion/react"
import {
  useMotionUITheme,
  useMotionUITransition,
  type ResolvedMotionUITheme,
} from "@/components/motion-ui/ui-theme"

export interface RevealVariants {
  theme: ResolvedMotionUITheme
  /** Reduced motion requested: no animation at all. */
  still: boolean
  /** Reduced motion requested: opacity-only fades. */
  calm: boolean
  /** Parent that staggers its children on entering the viewport. */
  container: Variants
  /** Fade-up child of a `container`. */
  item: Variants
}

/** Shared whileInView vocabulary: staggered fade-up entrances on the theme's tokens. */
export function useReveal(): RevealVariants {
  const theme = useMotionUITheme()
  const ui = useMotionUITransition("ui")
  const still = theme.motionMode === "off"
  const calm = theme.motionMode === "calm"

  return {
    theme,
    still,
    calm,
    container: {
      hidden: {},
      show: {
        transition: { staggerChildren: calm ? 0 : theme.stagger.base },
      },
    },
    // Literal transform strings (not the y shorthand) so Motion can run the
    // travel on the compositor via WAAPI.
    item: {
      hidden: {
        opacity: 0,
        transform: calm ? "none" : `translateY(${theme.travel.enter}px)`,
      },
      show: { opacity: 1, transform: "translateY(0px)", transition: { ...ui } },
    },
  }
}
