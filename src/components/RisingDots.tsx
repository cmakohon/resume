import { cancelFrame, frame, type FrameData } from "motion/react"
import { useEffect, useMemo, useRef } from "react"
import { useAmbient } from "@/components/ambient"
import { useMotionUITheme } from "@/components/motion-ui/ui-theme"

type Kind = "accent" | "strong" | "soft"

interface Dot {
  /** Start position as a percentage of the layer. */
  x: number
  y: number
  size: number
  kind: Kind
  riseDuration: number
  riseDelay: number
  swayDuration: number
  swayDelay: number
}

/** Dot colors per surface: ink on the page, light on the dark footer. */
const TONES: Record<"page" | "footer", Record<Kind, string>> = {
  page: {
    accent: "bg-accent/75",
    strong: "bg-foreground/30",
    soft: "bg-foreground/15",
  },
  footer: {
    accent: "bg-accent/80",
    strong: "bg-footer-foreground/35",
    soft: "bg-footer-foreground/18",
  },
}

/** How far a dot rises over one loop, as a share of the layer's height. */
const RISE = 0.58

/** Hover push: radius of influence and the most any dot moves, in px. */
const RADIUS = 160
const PUSH = 14
/** How quickly dots follow the pointer and settle back, per second. */
const FOLLOW = 6

export interface RisingDotsProps {
  /** Which surface the dots sit on, for their colors. */
  tone?: "page" | "footer"
  /** Layout seed. Seed 4 is the hero layout picked on the design canvas. */
  seed?: number
}

/**
 * Dots rising slowly up the right of their parent, swaying a little and
 * fading in and out. On hover the nearest dots lean away from the pointer.
 * Fills its parent (which needs `position: relative`) and listens for the
 * pointer on it.
 *
 * Every dot is nested spans so each motion owns one transform:
 * pointer push (written here) > rise (CSS, also the fade) > sway (CSS).
 */
export function RisingDots({ tone = "page", seed = 4 }: RisingDotsProps) {
  const theme = useMotionUITheme()
  const layerRef = useRef<HTMLDivElement>(null)
  const pushRefs = useRef<(HTMLSpanElement | null)[]>([])
  const riseRefs = useRef<(HTMLSpanElement | null)[]>([])
  const ambient = useAmbient(layerRef)
  const dots = useMemo(() => makeDots(seed), [seed])
  const colors = TONES[tone]
  const interactive = theme.motionMode === "full"

  // The rise distance tracks the layer's height (ambient-rise reads --rise).
  useEffect(() => {
    const layer = layerRef.current
    if (!layer) return
    const setRise = () =>
      layer.style.setProperty("--rise", `${layer.offsetHeight * RISE}px`)
    setRise()
    const resize = new ResizeObserver(setRise)
    resize.observe(layer)
    return () => resize.disconnect()
  }, [])

  useEffect(() => {
    const layer = layerRef.current
    const host = layer?.parentElement
    if (!interactive || !layer || !host) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const pushEls = pushRefs.current
    const riseEls = riseRefs.current
    const count = dots.length
    const home = new Float32Array(count * 2)
    const offset = new Float32Array(count * 2)
    // Each dot's rise animation, so its live height can be worked out from
    // its clock (the rise is linear) instead of measuring the page.
    const rises: (Animation | undefined)[] = new Array(count)
    let left = 0
    let top = 0
    let rise = 0
    let pointerX = 0
    let pointerY = 0
    let inside = false
    let running = false

    const measure = () => {
      const rect = layer.getBoundingClientRect()
      left = rect.left
      top = rect.top
      rise = rect.height * RISE
      for (let i = 0; i < count; i++) {
        home[i * 2] = (dots[i].x / 100) * rect.width
        home[i * 2 + 1] = (dots[i].y / 100) * rect.height
        rises[i] = riseEls[i]?.getAnimations()[0]
      }
    }

    const step = ({ delta }: FrameData) => {
      const ease = 1 - Math.exp((-delta / 1000) * FOLLOW)
      let settling = false

      for (let i = 0; i < count; i++) {
        let targetX = 0
        let targetY = 0
        if (inside) {
          const dot = dots[i]
          const time = rises[i]?.currentTime
          const elapsed = typeof time === "number" ? time / 1000 - dot.riseDelay : 0
          const progress = (elapsed % dot.riseDuration) / dot.riseDuration
          const dx = home[i * 2] - pointerX
          const dy = home[i * 2 + 1] - progress * rise - pointerY
          const distance = Math.hypot(dx, dy)
          if (distance < RADIUS && distance > 0.5) {
            const falloff = 1 - distance / RADIUS
            const force = falloff * falloff * PUSH * (0.6 + dot.size / 6)
            targetX = (dx / distance) * force
            targetY = (dy / distance) * force
          }
        }

        const x = offset[i * 2]
        const y = offset[i * 2 + 1]
        const nextX = x + (targetX - x) * ease
        const nextY = y + (targetY - y) * ease
        if (Math.abs(targetX - nextX) > 0.05 || Math.abs(targetY - nextY) > 0.05) {
          settling = true
        }
        if (nextX === x && nextY === y) continue

        offset[i * 2] = nextX
        offset[i * 2 + 1] = nextY
        const el = pushEls[i]
        if (el) el.style.transform = `translate(${nextX}px, ${nextY}px)`
      }

      if (!inside && !settling) {
        cancelFrame(step)
        running = false
      }
    }

    const start = () => {
      if (running) return
      running = true
      frame.render(step, true)
    }

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX - left
      pointerY = event.clientY - top
      inside = true
      start()
    }
    const onLeave = () => {
      inside = false
    }
    const onScroll = () => {
      if (inside) measure()
    }

    measure()
    const resize = new ResizeObserver(measure)
    resize.observe(layer)
    host.addEventListener("pointerenter", measure)
    host.addEventListener("pointermove", onMove, { passive: true })
    host.addEventListener("pointerleave", onLeave)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      resize.disconnect()
      host.removeEventListener("pointerenter", measure)
      host.removeEventListener("pointermove", onMove)
      host.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("scroll", onScroll)
      cancelFrame(step)
      for (const el of pushEls) if (el) el.style.transform = ""
    }
  }, [dots, interactive])

  return (
    <div
      ref={layerRef}
      {...ambient}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden max-sm:opacity-50"
    >
      {dots.map((dot, i) => (
        <span
          key={i}
          className="absolute"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        >
          <span
            ref={(el) => {
              pushRefs.current[i] = el
            }}
            className="block"
          >
            <span
              ref={(el) => {
                riseRefs.current[i] = el
              }}
              className="ambient-rise block"
              style={{
                animationDuration: `${dot.riseDuration}s`,
                animationDelay: `${dot.riseDelay}s`,
              }}
            >
              <span
                className={`ambient-sway-x block rounded-full ${colors[dot.kind]}`}
                style={{
                  width: dot.size,
                  height: dot.size,
                  animationDuration: `${dot.swayDuration}s`,
                  animationDelay: `${dot.swayDelay}s`,
                }}
              />
            </span>
          </span>
        </span>
      ))}
    </div>
  )
}

function makeDots(seed: number): Dot[] {
  let state = seed >>> 0
  const random = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const round = (n: number) => Math.round(n * 10) / 10

  // Same draw order as the design canvas, so seed 4 lands identically.
  // Laid out on a 1280x720 frame, stored as percentages.
  const dots: Dot[] = []
  while (dots.length < 60) {
    const x = random() * 1280
    const y = 240 + random() * 540
    // Mostly clear of the copy column on the left.
    if (x < 860 && random() > 0.15) continue
    const riseDuration = round(34 + random() * 30)
    const swayDuration = round(7 + random() * 6)
    const accent = random() < 0.2
    const size = round(accent ? 3 + random() * 2.5 : 1.8 + random() * 2.4)
    const kind: Kind = accent ? "accent" : random() < 0.35 ? "strong" : "soft"
    dots.push({
      x: round((x / 1280) * 100),
      y: round((y / 720) * 100),
      size,
      kind,
      riseDuration,
      riseDelay: round(-random() * riseDuration),
      swayDuration,
      swayDelay: round(-random() * swayDuration),
    })
  }
  return dots
}
