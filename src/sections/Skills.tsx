import { motion } from "motion/react"
import { useReveal } from "@/components/reveal"
import { skillGroups } from "@/content/skills"

export function Skills() {
  const { theme, still, container, item } = useReveal()

  return (
    <section
      id="skills"
      className="w-full overflow-x-clip border-t border-border bg-card/60 px-6 py-24 sm:px-10"
      aria-labelledby="skills-heading"
    >
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-12"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.2, once: theme.inView.once }}
      >
        <motion.h2
          id="skills-heading"
          className="label-mono text-muted-foreground"
          variants={item}
        >
          Toolbox
        </motion.h2>

        <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <motion.div
              key={group.label}
              className="flex flex-col gap-4"
              variants={item}
            >
              <h3 className="text-sm font-semibold tracking-tight">
                {group.label}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="font-mono text-[0.8125rem] text-muted-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
