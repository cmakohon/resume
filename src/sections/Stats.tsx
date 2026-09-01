import { motion, useInView } from "motion/react"
import { useRef, useState } from "react"
import type { Variants } from "motion/react"
import { AnimatedNumber } from "@/components/motion-ui/animated-number"
import { useMotionUITheme, useMotionUITransition } from "@/components/motion-ui/ui-theme"
import { useReveal } from "@/components/reveal"
import { stats, type Stat } from "@/content/site"

export function Stats() {
  const { theme, still, calm, container, item } = useReveal()
  const motionAllowed = !still && !calm

  return (
    <section
      id="stats"
      className="w-full overflow-x-clip border-y border-border bg-card/60 px-6 py-20 sm:px-10"
      aria-label="Career at a glance"
    >
      <motion.div
        className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: theme.inView.amount, once: theme.inView.once }}
      >
        {stats.map((stat) => (
          <StatTile
            key={stat.label}
            stat={stat}
            motionAllowed={motionAllowed}
            itemVariants={item}
          />
        ))}
      </motion.div>
    </section>
  )
}

function StatTile({
  stat,
  motionAllowed,
  itemVariants,
}: {
  stat: Stat
  motionAllowed: boolean
  itemVariants: Variants
}) {
  const [revealed, setRevealed] = useState(!motionAllowed)
  return (
    <motion.div
      className="h-full"
      variants={itemVariants}
      onAnimationComplete={
        motionAllowed
          ? (definition) => {
              if (definition === "show") setRevealed(true)
            }
          : undefined
      }
    >
      <div className="flex h-full flex-col gap-3 p-2">
        <StatRule />
        <div className="font-mono text-5xl font-semibold leading-none tabular-nums">
          <AnimatedNumber
            value={stat.value}
            from={0}
            revealed={revealed}
            transition="gentle"
            format={stat.format}
            suffix={stat.suffix}
            className="stat-value"
          />
        </div>
        <span className="max-w-[24ch] text-sm text-muted-foreground">
          {stat.label}
        </span>
      </div>
    </motion.div>
  )
}

function StatRule() {
  const ref = useRef<HTMLSpanElement>(null)
  const theme = useMotionUITheme()
  const motionAllowed = theme.motionMode === "full"
  const ui = useMotionUITransition("ui")
  const inView = useInView(ref, {
    amount: theme.inView.amount,
    once: theme.inView.once,
  })
  const revealed = !motionAllowed || inView

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      className="block h-[2px] w-7 origin-left bg-primary"
      initial={motionAllowed ? { scaleX: 0 } : false}
      animate={{ scaleX: revealed ? 1 : 0 }}
      transition={{ ...ui }}
    />
  )
}
