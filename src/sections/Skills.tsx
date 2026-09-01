import { motion } from "motion/react"
import { useReveal } from "@/components/reveal"
import { skillGroups } from "@/content/skills"

export function Skills() {
  const { theme, still, container, item, itemLeft } = useReveal()

  return (
    <section
      id="skills"
      className="w-full overflow-x-clip border-t border-border px-6 py-20 sm:px-10"
      aria-labelledby="skills-heading"
    >
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col gap-10"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.2, once: theme.inView.once }}
      >
        <div className="flex flex-col gap-3">
          <motion.h2
            id="skills-heading"
            className="label-mono text-muted-foreground"
            variants={item}
          >
            Toolbox
          </motion.h2>
          <motion.p
            className="max-w-[52ch] text-sm leading-relaxed text-muted-foreground"
            variants={item}
          >
            Things I've actually shipped with, not things I've read one blog
            post about.
          </motion.p>
        </div>

        <div>
          {skillGroups.map((group) => (
            <motion.div
              key={group.label}
              className="grid grid-cols-1 gap-2 border-b border-border py-5 first:border-t sm:grid-cols-[10rem_1fr] sm:gap-8"
              variants={itemLeft}
            >
              <h3 className="label-mono pt-0.5 text-primary">{group.label}</h3>
              <p className="font-mono text-[0.8125rem] leading-relaxed text-muted-foreground">
                {group.items.join(" · ")}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
