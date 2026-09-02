import { motion } from "motion/react"
import { useReveal } from "@/components/reveal"
import { projects, projectsIntro } from "@/content/projects"

export function Projects() {
  const { theme, still, container, item } = useReveal()

  return (
    <section
      id="projects"
      className="w-full overflow-x-clip border-t border-border px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="projects-heading"
    >
      <motion.header
        className="mx-auto mb-16 flex w-full max-w-5xl flex-col gap-5"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: theme.inView.amount, once: theme.inView.once }}
      >
        <motion.p className="label-mono text-primary" variants={item}>
          Nights and weekends
        </motion.p>
        <motion.h2
          id="projects-heading"
          className="max-w-[20ch] text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          variants={item}
        >
          Things I'm shipping on my own time.
        </motion.h2>
        <motion.p
          className="max-w-[56ch] text-base leading-relaxed text-muted-foreground"
          variants={item}
        >
          {projectsIntro}
        </motion.p>
      </motion.header>

      {/* Product rows, one per app. A ledger, not a card grid. */}
      <motion.div
        className="mx-auto w-full max-w-5xl"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.15, once: theme.inView.once }}
      >
        {projects.map((project) => (
          <motion.article
            key={project.id}
            className="grid grid-cols-1 gap-6 border-t border-border py-12 last:border-b lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-20"
            variants={item}
            aria-labelledby={`project-${project.id}`}
          >
            <div className="flex flex-col gap-3">
              <p className="label-mono text-muted-foreground">{project.platform}</p>
              <h3
                id={`project-${project.id}`}
                className="text-3xl font-semibold tracking-tight"
              >
                {project.name}
              </h3>
              <p className="max-w-[34ch] text-base leading-relaxed text-muted-foreground">
                {project.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <p className="max-w-[58ch] text-base leading-relaxed text-muted-foreground">
                {project.body}
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="Technologies">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="label-mono rounded-full border border-border px-3 py-1.5 text-muted-foreground"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
              <a
                href={project.store.href}
                target="_blank"
                rel="noreferrer"
                className="label-mono self-start text-primary transition-colors hover:text-foreground"
              >
                {project.store.label} ↗
              </a>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  )
}
