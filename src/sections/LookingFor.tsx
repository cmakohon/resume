import { motion } from "motion/react"
import { useReveal } from "@/components/reveal"
import { lookingForGroups, lookingForIntro } from "@/content/lookingFor"

export function LookingFor() {
  const { theme, still, container, item } = useReveal()

  return (
    <section
      id="looking-for"
      className="w-full overflow-x-clip border-t border-border px-6 py-24 sm:px-10"
      aria-labelledby="looking-for-heading"
    >
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-12"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.2, once: theme.inView.once }}
      >
        <div className="flex flex-col gap-6">
          <motion.h2
            id="looking-for-heading"
            className="label-mono text-muted-foreground"
            variants={item}
          >
            What I'm looking for
          </motion.h2>
          <motion.p
            className="max-w-[56ch] text-base leading-relaxed text-muted-foreground"
            variants={item}
          >
            {lookingForIntro}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2">
          {lookingForGroups.map((group) => (
            <motion.article
              key={group.title}
              className="flex flex-col gap-3"
              variants={item}
            >
              <span
                aria-hidden="true"
                className="block h-[2px] w-7 bg-primary"
              />
              <h3 className="text-xl font-semibold tracking-tight">
                {group.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {group.body}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
