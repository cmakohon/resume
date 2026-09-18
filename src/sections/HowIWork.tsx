import { motion } from "motion/react"
import { useReveal } from "@/components/reveal"
import { workPrinciples, workStatement } from "@/content/howIWork"

export function HowIWork() {
  const { theme, still, container, item } = useReveal()

  return (
    <section
      id="how-i-work"
      className="w-full overflow-x-clip border-t border-border px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="how-i-work-heading"
    >
      <motion.header
        className="mx-auto mb-16 flex w-full max-w-4xl flex-col gap-5"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: theme.inView.amount, once: theme.inView.once }}
      >
        <motion.p className="label-mono text-primary" variants={item}>
          How I work
        </motion.p>
        <motion.h2
          id="how-i-work-heading"
          className="max-w-[26ch] text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl"
          variants={item}
        >
          {workStatement}
        </motion.h2>
      </motion.header>

      {/* The practice behind the thesis: a numbered essay list, not a feature grid. */}
      <motion.ol
        className="mx-auto w-full max-w-4xl list-none p-0"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.15, once: theme.inView.once }}
      >
        {workPrinciples.map((principle, index) => (
          <motion.li
            key={principle.title}
            className="grid grid-cols-1 gap-3 border-t border-border py-10 sm:grid-cols-[4rem_1fr] sm:gap-8"
            variants={item}
          >
            <span aria-hidden="true" className="label-mono pt-1.5 text-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold tracking-tight">
                {principle.title}
              </h3>
              <p className="max-w-[62ch] text-base leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  )
}
