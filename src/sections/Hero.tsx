import { motion } from "motion/react"
import { useState } from "react"
import { SplitReveal } from "@/components/motion-ui/split-reveal"
import { useMotionUITheme, useMotionUITransition } from "@/components/motion-ui/ui-theme"
import { site } from "@/content/site"

export function Hero() {
  const theme = useMotionUITheme()
  const still = theme.motionMode === "off"
  const calm = theme.motionMode === "calm"
  const ui = useMotionUITransition("ui")
  const [headlineComplete, setHeadlineComplete] = useState(false)

  // Literal transform strings keep these entrances compositor-driven.
  const riseFrom = calm ? "none" : `translateY(${theme.travel.enter}px)`
  const riseTo = "translateY(0px)"

  return (
    <section
      className="relative flex min-h-svh w-full flex-col justify-center overflow-x-clip px-6 py-24 sm:px-10"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-8">
        <motion.p
          className="label-mono text-muted-foreground"
          initial={still ? false : { opacity: 0, transform: riseFrom }}
          animate={{ opacity: 1, transform: riseTo }}
          transition={{ ...ui }}
        >
          {site.name} · {site.location}
        </motion.p>

        <SplitReveal
          as="h1"
          id="hero-heading"
          ariaLabel={site.hero.headline}
          granularity="words"
          hoverWave={1.5}
          delay={theme.motionMode === "full" ? 0.15 : 0}
          onRevealComplete={() => setHeadlineComplete(true)}
          className="max-w-[16ch] text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
        >
          {site.hero.headline}
        </SplitReveal>

        <p className="sr-only">{site.hero.subline}</p>
        <SplitReveal
          as="p"
          ariaHidden
          granularity="lines"
          start={headlineComplete}
          className="max-w-[52ch] text-balance text-lg leading-relaxed text-muted-foreground"
        >
          {site.hero.subline}
        </SplitReveal>

        <motion.div
          className="flex flex-wrap items-center gap-4 pt-2"
          initial={still ? false : { opacity: 0, transform: riseFrom }}
          animate={
            headlineComplete || still
              ? { opacity: 1, transform: riseTo }
              : undefined
          }
          transition={{ ...ui }}
        >
          <a
            href="#timeline"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
          >
            View the work ↓
          </a>
          <a
            href={site.resumePdf}
            download
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
          >
            Download resume
          </a>
          <span className="label-mono hidden text-faint sm:inline">
            <a className="transition-colors hover:text-foreground" href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {" / "}
            <a className="transition-colors hover:text-foreground" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </span>
        </motion.div>
      </div>

      <motion.a
        href="#timeline"
        aria-label="Scroll to content"
        className="label-mono absolute bottom-8 left-1/2 -translate-x-1/2 text-faint transition-colors hover:text-foreground"
        initial={still ? false : { opacity: 0 }}
        animate={headlineComplete || still ? { opacity: 1 } : undefined}
        transition={{ ...ui, delay: 0.3 }}
      >
        Scroll
      </motion.a>
    </section>
  )
}
