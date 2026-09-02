import { animate, circIn, circOut, easeOut, hover, stagger } from "motion"
import { splitText } from "motion-plus"
import { createElement, useLayoutEffect, useRef, type ReactElement } from "react"
import { useMotionUITheme, useMotionUITransition } from "@/components/motion-ui/ui-theme"

const LINE_CLASS = "motion-ui-split-line"
const WORD_CLASS = "motion-ui-split-word"
const CHAR_CLASS = "motion-ui-split-char"

const RISE_FROM = "translateY(120%)"
const RISE_TO = "translateY(0%)"
const MASK_BREATHING = "0.16em"

/** The unit the reveal staggers by. */
export type Granularity = "lines" | "words" | "chars"

/** Resolved reduced-motion state for the reveal. */
type RevealMode = "run" | "calm" | "off"

/** Elements this reveal can render as. */
export type SplitRevealTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"

export interface SplitRevealProps {
  /** Plain text to split and reveal. */
  children: string
  /** Unit the stagger runs over. Defaults to `"lines"`. */
  granularity?: Granularity
  /** Element to render. Defaults to `"p"`. */
  as?: SplitRevealTag
  /** Timeline start offset in seconds. */
  delay?: number
  /** Whether this reveal may start. Defaults to `true`. */
  start?: boolean
  /**
   * Called once when the entrance actually begins (fonts ready, text split,
   * first unit in motion). Choreograph companions from this, not from
   * `onRevealComplete`: springs settle well after they look finished.
   */
  onRevealStart?: VoidFunction
  /** Called once after every entrance unit has settled. */
  onRevealComplete?: VoidFunction
  /**
   * Hover wave amplitude as a multiplier on `travel.hover`. Omit for no wave.
   * The wave only arms once the entrance has settled: it animates the same
   * transforms, and interrupting an in-flight entrance would stop it without
   * ever resolving its promise.
   */
  hoverWave?: number
  /** Hover bounce duration multiplier on the `ambient` token. Defaults to `1`. */
  hoverWaveDuration?: number
  /** Hover cascade speed multiplier on `stagger.tight`. Defaults to `1`. */
  hoverWaveStagger?: number
  /** Forwarded to the rendered element. */
  id?: string
  /** Merged onto the rendered element. */
  className?: string
  /** Whole-line accessible name past the per-unit split. */
  ariaLabel?: string
  /** Hide from assistive tech when a sibling `sr-only` copy carries the text. */
  ariaHidden?: boolean
}

/** Masked split-stagger text reveal. */
export function SplitReveal({
  children,
  granularity = "lines",
  as = "p",
  delay = 0,
  start = true,
  onRevealStart,
  onRevealComplete,
  hoverWave,
  hoverWaveDuration = 1,
  hoverWaveStagger = 1,
  id,
  className,
  ariaLabel,
  ariaHidden,
}: SplitRevealProps): ReactElement {
  const ref = useRef<HTMLElement | null>(null)
  const theme = useMotionUITheme()
  const still = theme.motionMode === "off"
  const calm = theme.motionMode === "calm"
  const mode: RevealMode = still ? "off" : calm ? "calm" : "run"

  // Theme hooks are not referentially stable; read them through refs inside the async fonts.ready callback.
  const gentle = useMotionUITransition("gentle")
  const ambient = useMotionUITransition("ambient")
  const gentleRef = useRef(gentle)
  const ambientRef = useRef(ambient)
  const themeRef = useRef(theme)
  const onRevealStartRef = useRef(onRevealStart)
  const onRevealCompleteRef = useRef(onRevealComplete)
  gentleRef.current = gentle
  ambientRef.current = ambient
  themeRef.current = theme
  onRevealStartRef.current = onRevealStart
  onRevealCompleteRef.current = onRevealComplete

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    if (!start) {
      el.style.visibility = "hidden"
      return () => {
        el.style.visibility = "visible"
      }
    }

    let cancelled = false
    let started = false
    let completed = false
    const notifyRevealStart = () => {
      if (cancelled || started) return
      started = true
      onRevealStartRef.current?.()
    }
    const notifyRevealComplete = () => {
      if (cancelled || completed) return
      completed = true
      onRevealCompleteRef.current?.()
    }

    if (mode === "off") {
      notifyRevealStart()
      notifyRevealComplete()
      return
    }

    el.style.visibility = "hidden"

    const gentleTransition = gentleRef.current
    const animations: ReturnType<typeof animate>[] = []
    let detachHover: VoidFunction | undefined
    let settleTimer: ReturnType<typeof setTimeout> | undefined

    document.fonts.ready.then(() => {
      const node = ref.current
      if (cancelled || !node) return

      // Reset so splitText always operates on fresh, un-split markup.
      node.textContent = children

      const { lines, words, chars } = splitText(node, {
        lineClass: LINE_CLASS,
        wordClass: WORD_CLASS,
        charClass: CHAR_CLASS,
      })

      lines.forEach((line) => {
        line.style.display = "block"
        line.style.overflow = "hidden"
        line.style.paddingBlock = MASK_BREATHING
        line.style.marginBlock = `-${MASK_BREATHING}`
      })
      words.forEach((word) => {
        word.style.display = "inline-block"
      })
      chars.forEach((char) => {
        char.style.display = "inline-block"
      })

      node.style.visibility = "visible"
      notifyRevealStart()

      if (mode === "calm") {
        const animation = animate(
          node,
          { opacity: [0, 1] },
          { ...gentleTransition, delay }
        )
        animations.push(animation)
        void Promise.resolve(animation).then(notifyRevealComplete, () => {})
        return
      }

      const themeTokens = themeRef.current
      const revealUnits: HTMLElement[] = granularity === "chars" ? chars : words

      if (granularity === "lines") {
        let lineDelay = delay
        lines.forEach((line) => {
          const lineWords = words.filter((word) => line.contains(word))
          animations.push(
            animate(
              lineWords,
              { transform: [RISE_FROM, RISE_TO] },
              { ...gentleTransition, delay: lineDelay }
            )
          )
          lineDelay += themeTokens.stagger.relaxed
        })
      } else if (granularity === "words") {
        animations.push(
          animate(
            words,
            { transform: [RISE_FROM, RISE_TO] },
            {
              ...gentleTransition,
              delay: stagger(themeTokens.stagger.base, { startDelay: delay }),
            }
          )
        )
      } else {
        animations.push(
          animate(
            chars,
            { transform: [RISE_FROM, RISE_TO] },
            {
              ...gentleTransition,
              delay: stagger(themeTokens.stagger.tight, { startDelay: delay }),
            }
          )
        )
      }

      const armHoverWave = () => {
        if (cancelled || detachHover || !hoverWave || revealUnits.length === 0) return
        const amplitude = themeTokens.travel.hover * hoverWave
        const ambient = ambientRef.current
        const waveDuration = ambient.duration * hoverWaveDuration
        const waveStagger = themeTokens.stagger.tight * hoverWaveStagger
        detachHover = hover(node, () => {
          if (cancelled) return
          animate(
            revealUnits,
            {
              // null reads the live transform so a re-hover mid-wave continues from where the unit is.
              transform: [
                null,
                `translateY(-${amplitude}px)`,
                "translateY(0px)",
              ],
            },
            {
              type: "tween",
              duration: waveDuration,
              ease: [circOut, circIn],
              times: [0, 0.55, 1],
              delay: stagger(waveStagger, { ease: easeOut }),
            }
          )
        })
      }

      const settle = () => {
        if (settleTimer !== undefined) clearTimeout(settleTimer)
        notifyRevealComplete()
        armHoverWave()
      }

      void Promise.all(animations).then(settle, () => {})

      // Safety net: a stopped native animation never resolves its promise, so
      // settle on the clock too. Generous on purpose; it only matters when the
      // promise path has already gone quiet.
      const unitCount =
        granularity === "lines" ? lines.length : revealUnits.length
      const staggerStep =
        granularity === "lines"
          ? themeTokens.stagger.relaxed
          : granularity === "words"
            ? themeTokens.stagger.base
            : themeTokens.stagger.tight
      const settleAfter =
        delay +
        staggerStep * Math.max(0, unitCount - 1) +
        gentleTransition.duration * 2 +
        0.25
      settleTimer = setTimeout(settle, settleAfter * 1000)
    })

    return () => {
      cancelled = true
      if (settleTimer !== undefined) clearTimeout(settleTimer)
      detachHover?.()
      animations.forEach((animation) => animation.stop())
      const node = ref.current
      if (node) node.style.visibility = "visible"
    }
  }, [
    children,
    granularity,
    mode,
    delay,
    start,
    hoverWave,
    hoverWaveDuration,
    hoverWaveStagger,
  ])

  return createElement(
    as,
    {
      ref: (node: HTMLElement | null) => {
        ref.current = node
      },
      id,
      className,
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden,
      // No inline visibility: no-JS output stays plain and readable.
    },
    children
  )
}
