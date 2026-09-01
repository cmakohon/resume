import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import { Fragment, useRef } from "react"
import { useReveal } from "@/components/reveal"
import { workPrinciples, workStatement } from "@/content/howIWork"

const START_OPACITY = 0.15
const SPREAD = 0.8
const WORD_DURATION = 0.2

interface WordProgressRange {
  start: number
  end: number
}

function getWordProgressRange(index: number, count: number): WordProgressRange {
  const start = count <= 1 ? 0 : (index / (count - 1)) * SPREAD
  return { start, end: Math.min(1, start + WORD_DURATION) }
}

function Word({
  children,
  progress,
  index,
  count,
  reducedMotion,
}: {
  children: string
  progress: MotionValue<number>
  index: number
  count: number
  reducedMotion: boolean
}) {
  // Array-keyframe form (not function form) so each word's fade stays
  // hardware-accelerated on the scroll timeline. The plateaus are spelled out
  // as explicit keyframes: a bare [start, end] window survives the WAAPI
  // scroll-timeline conversion with its offsets misapplied.
  const { start, end } = getWordProgressRange(index, count)
  const opacity = useTransform(
    progress,
    [0, start, end, 1],
    [START_OPACITY, START_OPACITY, 1, 1],
    { clamp: true }
  )

  return (
    <motion.span
      aria-hidden="true"
      style={reducedMotion ? undefined : { opacity }}
    >
      {children}
    </motion.span>
  )
}

export function HowIWork() {
  const { theme, still, container, item } = useReveal()
  const reducedMotion = theme.motionMode !== "full"
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  })
  const progressScale = useTransform(
    scrollYProgress,
    [0, 1],
    ["scaleY(0)", "scaleY(1)"]
  )
  const words = workStatement.split(" ")

  return (
    <section
      id="how-i-work"
      className="w-full overflow-x-clip border-t border-border"
      aria-labelledby="how-i-work-heading"
    >
      {/* Sticky stage: the thesis brightens word by word across the scroll range. */}
      <div
        ref={stageRef}
        className={reducedMotion ? "" : "min-h-[220vh]"}
      >
        <div className="sticky top-0 flex min-h-svh w-full items-center overflow-hidden px-6 py-16 sm:px-10">
          <div className="mx-auto grid w-full max-w-4xl grid-cols-[1px_minmax(0,1fr)] items-start gap-10 max-sm:grid-cols-1 max-sm:gap-0">
            <div
              aria-hidden="true"
              className="relative h-28 w-px overflow-hidden bg-border max-sm:hidden"
            >
              <motion.span
                className="absolute inset-0 block origin-top bg-foreground"
                style={{
                  transform: reducedMotion ? undefined : progressScale,
                }}
              />
            </div>

            <div>
              <p className="label-mono mb-10 text-muted-foreground">
                How I work
              </p>
              <h2
                id="how-i-work-heading"
                className="max-w-[26ch] text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl"
                aria-label={workStatement}
              >
                {words.map((word, index) => (
                  <Fragment key={`${word}-${index}`}>
                    <Word
                      progress={scrollYProgress}
                      index={index}
                      count={words.length}
                      reducedMotion={reducedMotion}
                    >
                      {word}
                    </Word>
                    {index < words.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* The practice behind the thesis: a numbered essay list, not a feature grid. */}
      <motion.ol
        className="mx-auto w-full max-w-4xl list-none px-6 pb-28 pt-4 sm:px-10"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.15, once: theme.inView.once }}
      >
        {workPrinciples.map((principle, index) => (
          <motion.li
            key={principle.title}
            className="grid grid-cols-1 gap-3 border-t border-border py-10 first:border-t-0 first:pt-0 sm:grid-cols-[4rem_1fr] sm:gap-8"
            variants={item}
          >
            <span aria-hidden="true" className="label-mono pt-1.5 text-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold tracking-tight">
                {principle.title}
              </h3>
              <p className="max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
