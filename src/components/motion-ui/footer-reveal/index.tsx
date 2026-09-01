import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import { useMotionUITheme } from "@/components/motion-ui/ui-theme"

interface FooterRevealContextValue {
  /** Reveal progress: 0 until uncover begins, then 0 → 1. */
  reveal: MotionValue<number>
  /** Scale scrubbed with reveal: 0.9 → 1. */
  scale: MotionValue<number>
  /** Blur filter scrubbed with reveal. */
  filter: MotionValue<string>
  /** `will-change` for the opacity surface while scrubbing. */
  opacityWillChange: MotionValue<"auto" | "opacity">
  /** `will-change` for the scale/blur layer while scrubbing. */
  contentWillChange: MotionValue<"auto" | "transform, filter">
  /** Ref for the page body (reveal trigger). */
  contentRef: RefObject<HTMLElement | null>
  /** Ref for the sticky footer (sizes the reveal window). */
  footerRef: RefObject<HTMLElement | null>
}

const FooterRevealContext = createContext<FooterRevealContextValue | null>(
  null
)

function useFooterRevealContext(part: string): FooterRevealContextValue {
  const ctx = useContext(FooterRevealContext)
  if (!ctx) {
    throw new Error(`${part} must be rendered inside a <FooterReveal>.`)
  }
  return ctx
}

export interface FooterRevealProps {
  /** `FooterRevealContent` then `FooterRevealFooter`. */
  children?: ReactNode
  /** Merged onto the root. Never add overflow clipping here. */
  className?: string
}

/** Page root that owns reveal progress and publishes it via context. */
export function FooterReveal({ children, className }: FooterRevealProps) {
  const uiTheme = useMotionUITheme()
  const motionAllowed = uiTheme.motionMode === "full"
  const contentRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const [revealAt, setRevealAt] = useState(0.35)

  useLayoutEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const update = () => {
      const footerHeight = footer.offsetHeight
      const viewportHeight = window.innerHeight || 1
      setRevealAt(
        Math.min(0.95, Math.max(0.05, footerHeight / viewportHeight))
      )
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(footer)
    window.addEventListener("resize", update)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["end end", "end start"],
  })
  const reveal = useTransform(
    scrollYProgress,
    [0, revealAt],
    motionAllowed ? [0, 1] : [1, 1]
  )
  const scale = useTransform(
    scrollYProgress,
    [0, revealAt],
    motionAllowed ? [0.9, 1] : [1, 1]
  )
  const blur = useTransform(
    scrollYProgress,
    [0, revealAt],
    motionAllowed ? [6, 0] : [0, 0]
  )
  const filter = useMotionTemplate`blur(${blur}px)`
  const opacityWillChange = useTransform(scrollYProgress, (progress) =>
    motionAllowed && progress > 0.0001 && progress < revealAt
      ? "opacity"
      : "auto"
  )
  const contentWillChange = useTransform(scrollYProgress, (progress) =>
    motionAllowed && progress > 0.0001 && progress < revealAt
      ? "transform, filter"
      : "auto"
  )

  const value: FooterRevealContextValue = {
    reveal,
    scale,
    filter,
    opacityWillChange,
    contentWillChange,
    contentRef,
    footerRef,
  }

  return (
    <FooterRevealContext.Provider value={value}>
      <div
        className={`relative isolate w-full overflow-visible${
          className ? ` ${className}` : ""
        }`}
      >
        {children}
      </div>
    </FooterRevealContext.Provider>
  )
}

export interface FooterRevealContentProps {
  /** Page body that covers the sticky footer until scroll. */
  children?: ReactNode
  /** Merged onto the content layer. Needs an opaque background. */
  className?: string
}

/** Page body layer above the sticky footer. */
export function FooterRevealContent({
  children,
  className,
}: FooterRevealContentProps) {
  const { contentRef } = useFooterRevealContext("<FooterRevealContent>")

  return (
    <div
      ref={contentRef as RefObject<HTMLDivElement>}
      className={`relative z-[1] bg-background${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  )
}

export interface FooterRevealFooterProps {
  /** Footer contents. */
  children?: ReactNode
  /** Merged onto the sticky footer shell. */
  className?: string
}

/** Sticky footer that fades, scales and sharpens as scroll uncovers it. */
export function FooterRevealFooter({
  children,
  className,
}: FooterRevealFooterProps) {
  const {
    reveal,
    scale,
    filter,
    opacityWillChange,
    contentWillChange,
    footerRef,
  } = useFooterRevealContext("<FooterRevealFooter>")

  return (
    <footer
      ref={footerRef}
      className="sticky bottom-0 z-[-1] w-full max-w-full"
    >
      <motion.div
        className={`w-full max-w-full${className ? ` ${className}` : ""}`}
        style={{ opacity: reveal, willChange: opacityWillChange }}
      >
        <motion.div
          className="w-full max-w-full"
          style={{
            scale,
            filter,
            transformOrigin: "50% 100%",
            willChange: contentWillChange,
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </footer>
  )
}

/** Raw reveal progress MotionValue from the enclosing `FooterReveal`. */
export function useFooterRevealProgress(): MotionValue<number> {
  return useFooterRevealContext("useFooterRevealProgress").reveal
}
