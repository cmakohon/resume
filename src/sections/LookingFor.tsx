import { motion } from "motion/react"
import { useReveal } from "@/components/reveal"
import { lookingForGroups, lookingForIntro } from "@/content/lookingFor"

export function LookingFor() {
  const { theme, still, container, item, itemLeft } = useReveal()

  return (
    <section
      id="looking-for"
      className="w-full overflow-x-clip border-t border-border px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="looking-for-heading"
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-24">
        {/* Statement track: pins while the answers scroll past. */}
        <motion.div
          className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start"
          variants={still ? undefined : container}
          initial={still ? false : "hidden"}
          whileInView={still ? undefined : "show"}
          viewport={{ amount: 0.3, once: theme.inView.once }}
        >
          <motion.h2
            id="looking-for-heading"
            className="label-mono text-primary"
            variants={item}
          >
            What I'm looking for
          </motion.h2>
          <motion.p
            className="max-w-[24ch] text-balance text-2xl font-medium leading-snug tracking-tight sm:text-3xl"
            variants={item}
          >
            {lookingForIntro}
          </motion.p>
        </motion.div>

        {/* Answer track. */}
        <motion.dl
          className="m-0 flex flex-col gap-12"
          variants={still ? undefined : container}
          initial={still ? false : "hidden"}
          whileInView={still ? undefined : "show"}
          viewport={{ amount: 0.15, once: theme.inView.once }}
        >
          {lookingForGroups.map((group) => (
            <motion.div
              key={group.title}
              className="flex flex-col gap-2"
              variants={itemLeft}
            >
              <dt className="label-mono text-muted-foreground">{group.title}</dt>
              <dd className="m-0 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
                {group.body}
              </dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
