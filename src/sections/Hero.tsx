import { motion } from "motion/react"
import { useRef, useState } from "react"
import { useAmbient } from "@/components/ambient"
import { RisingDots } from "@/components/RisingDots"
import { SplitReveal } from "@/components/motion-ui/split-reveal"
import { useMotionUITheme, useMotionUITransition } from "@/components/motion-ui/ui-theme"
import { site } from "@/content/site"

export function Hero() {
  const theme = useMotionUITheme()
  const still = theme.motionMode === "off"
  const calm = theme.motionMode === "calm"
  const gentle = useMotionUITransition("gentle")
  const full = theme.motionMode === "full"
  const [headlineStarted, setHeadlineStarted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const ambient = useAmbient(sectionRef)

  // Literal transform strings keep these entrances compositor-driven.
  const riseFrom = calm ? "none" : `translateY(${theme.travel.enter}px)`
  const riseTo = "translateY(0px)"
  const rise = { opacity: 1, transform: riseTo }

  // One cascade, one spring. The headline words start rising at
  // HEADLINE_DELAY and the last one lifts off around 0.35s; everything else
  // joins while those last words are still landing, on the same gentle
  // spring, so the hero reads as a single gesture rather than a headline
  // followed by an afterthought. Offsets are seconds after the headline's
  // entrance actually begins (fonts ready), not after mount.
  const HEADLINE_DELAY = full ? 0.05 : 0
  const follow = (offset: number) => ({
    ...gentle,
    delay: full ? offset : 0,
  })
  const DECK_AT = 0.2
  const SUBLINE_AT = 0.25
  const ACTIONS_AT = 0.3
  const CREDENTIALS_AT = 0.35

  return (
    <section
      ref={sectionRef}
      {...ambient}
      id="top"
      className="relative isolate flex min-h-svh w-full flex-col justify-center overflow-x-clip px-6 py-24 sm:px-10"
      aria-labelledby="hero-heading"
    >
      <RisingDots />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-8">
        <motion.p
          className="label-mono flex items-center gap-3 text-muted-foreground"
          initial={still ? false : { opacity: 0, transform: riseFrom }}
          animate={rise}
          transition={gentle}
        >
          <span aria-hidden="true" className="ambient-stretch h-0.5 w-8 origin-left bg-accent" />
          {site.location}
        </motion.p>

        {/* Headline and deck read as one block, so they sit tighter than the section gap. */}
        <div className="flex flex-col gap-5">
          <SplitReveal
            as="h1"
            id="hero-heading"
            ariaLabel={site.hero.headline}
            granularity="words"
            hoverWave={1.5}
            delay={HEADLINE_DELAY}
            onRevealStart={() => setHeadlineStarted(true)}
            className="max-w-[16ch] text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          >
            {site.hero.headline}
          </SplitReveal>

          <motion.p
            className="text-balance text-xl font-medium leading-snug tracking-tight sm:text-2xl"
            initial={still ? false : { opacity: 0, transform: riseFrom }}
            animate={headlineStarted || still ? rise : undefined}
            transition={follow(DECK_AT)}
          >
            {site.hero.deck}
          </motion.p>
        </div>

        <p className="sr-only">{site.hero.subline}</p>
        <SplitReveal
          as="p"
          ariaHidden
          granularity="lines"
          start={headlineStarted}
          delay={full ? SUBLINE_AT : 0}
          className="max-w-[52ch] text-balance text-lg leading-relaxed text-muted-foreground"
        >
          {site.hero.subline}
        </SplitReveal>

        <motion.div
          className="flex flex-wrap items-center gap-4 pt-2"
          initial={still ? false : { opacity: 0, transform: riseFrom }}
          animate={headlineStarted || still ? rise : undefined}
          transition={follow(ACTIONS_AT)}
        >
          <a
            href="#timeline"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground"
          >
            View the work ↓
          </a>
          <a
            href={site.resumePdf}
            download
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            Download resume
          </a>
          <span className="label-mono text-muted-foreground">
            <a className="transition-colors hover:text-primary" href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {" / "}
            <a className="transition-colors hover:text-primary" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </span>
        </motion.div>

        <motion.ul
          className="label-mono flex list-none flex-wrap items-center gap-x-3 gap-y-2 p-0 text-muted-foreground"
          initial={still ? false : { opacity: 0, transform: riseFrom }}
          animate={headlineStarted || still ? rise : undefined}
          transition={follow(CREDENTIALS_AT)}
        >
          {site.hero.credentials.map((credential, index) => (
            <li key={credential} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="text-accent">
                  ·
                </span>
              )}
              {credential}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
