import { cancelFrame, frame, type FrameData } from "motion/react"
import { useEffect, useRef, type RefObject } from "react"
import { useMotionUITheme } from "@/components/motion-ui/ui-theme"

interface Dot {
  /** Position as a percentage of the hero. */
  x: number
  y: number
  size: number
  /** 0 at the cloud's edge, 1 at its heart. Bigger, bluer, pushier. */
  near: number
  accent: boolean
  drift: string
  driftDuration: number
  driftDelay: number
  glowDuration: number
  glowDelay: number
}

/** Loops run this much faster than the canvas design's timings. */
const SPEED = 1.2

// Seeded so the cloud is the same on every visit (seed 12 is the one picked
// on the design canvas). Laid out on a 1280x720 frame, stored as percentages.
const DOTS = makeCloud(12)

/** Hover push: radius of influence and the most any dot moves, in px. */
const RADIUS = 160
const PUSH = 14
/** How quickly dots follow the pointer and settle back, per second. */
const FOLLOW = 6

/**
 * A loose cloud of dots on the right of the hero. Each dot drifts on its own
 * slow loop and breathes in and out (CSS, run by the useAmbient element it
 * sits in), and on hover the nearest dots lean away from the pointer.
 *
 * Every dot is three nested spans so each motion owns one transform:
 * pointer push (written here) > drift (CSS) > glow (CSS opacity).
 */
export function HeroCloud({ hostRef }: { hostRef: RefObject<HTMLElement | null> }) {
  const theme = useMotionUITheme()
  const layerRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([])
  const interactive = theme.motionMode === "full"

  useEffect(() => {
    const host = hostRef.current
    const layer = layerRef.current
    if (!interactive || !host || !layer) return
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const dots = dotRefs.current
    const count = DOTS.length
    const home = new Float32Array(count * 2)
    const offset = new Float32Array(count * 2)
    let left = 0
    let top = 0
    let pointerX = 0
    let pointerY = 0
    let inside = false
    let running = false

    const measure = () => {
      const rect = layer.getBoundingClientRect()
      left = rect.left
      top = rect.top
      for (let i = 0; i < count; i++) {
        home[i * 2] = (DOTS[i].x / 100) * rect.width
        home[i * 2 + 1] = (DOTS[i].y / 100) * rect.height
      }
    }

    const step = ({ delta }: FrameData) => {
      const ease = 1 - Math.exp((-delta / 1000) * FOLLOW)
      let settling = false

      for (let i = 0; i < count; i++) {
        let targetX = 0
        let targetY = 0
        if (inside) {
          const dx = home[i * 2] - pointerX
          const dy = home[i * 2 + 1] - pointerY
          const distance = Math.hypot(dx, dy)
          if (distance < RADIUS && distance > 0.5) {
            const falloff = 1 - distance / RADIUS
            const force = falloff * falloff * PUSH * (0.5 + DOTS[i].near * 0.8)
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
        const el = dots[i]
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
      for (const el of dots) if (el) el.style.transform = ""
    }
  }, [hostRef, interactive])

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden max-sm:opacity-50"
    >
      {DOTS.map((dot, i) => (
        <span
          key={i}
          ref={(el) => {
            dotRefs.current[i] = el
          }}
          className="absolute"
          style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
        >
          <span
            className={`${dot.drift} block`}
            style={{
              animationDuration: `${dot.driftDuration}s`,
              animationDelay: `${dot.driftDelay}s`,
            }}
          >
            <span
              className={`ambient-glow block rounded-full opacity-70 ${
                dot.accent ? "bg-accent/75" : "bg-foreground/30"
              }`}
              style={{
                width: dot.size,
                height: dot.size,
                animationDuration: `${dot.glowDuration}s`,
                animationDelay: `${dot.glowDelay}s`,
              }}
            />
          </span>
        </span>
      ))}
    </div>
  )
}

function makeCloud(seed: number): Dot[] {
  let state = seed >>> 0
  const random = () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const gauss = () =>
    Math.sqrt(-2 * Math.log(1 - random())) * Math.cos(2 * Math.PI * random())
  const round = (n: number) => Math.round(n * 10) / 10
  const drifts = ["ambient-drift-a", "ambient-drift-b", "ambient-drift-c"]

  const centerX = 1010
  const centerY = 360
  const dots: Dot[] = []
  while (dots.length < 96) {
    const x = centerX + gauss() * 170
    const y = centerY + gauss() * 160
    if (x < 0 || x > 1280 || y < 0 || y > 720) continue
    const near = Math.max(0, 1 - Math.hypot((x - centerX) / 340, (y - centerY) / 320))
    const driftDuration = round((24 + random() * 24) / SPEED)
    const glowDuration = round((7 + random() * 10) / SPEED)
    const accent = random() < 0.12 + near * 0.25
    const size = round(1.6 + near * 3 + random() * 1.6)
    const drift = drifts[Math.floor(random() * 3)]
    dots.push({
      x: round((x / 1280) * 100),
      y: round((y / 720) * 100),
      size,
      near,
      accent,
      drift,
      driftDuration,
      driftDelay: round(-random() * driftDuration),
      glowDuration,
      glowDelay: round(-random() * glowDuration),
    })
  }
  return dots
}
