import { motion, useScroll, useSpring, useTransform } from "motion/react"
import { useRef } from "react"
import { useReveal } from "@/components/reveal"
import { eras, type TimelineEra, type TimelineProject } from "@/content/timeline"

export function Timeline() {
  const { theme, still, container, item } = useReveal()
  const bodyRef = useRef<HTMLDivElement>(null)

  // The spine draws down as the reader moves through the career.
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ["start 0.75", "end 0.75"],
  })
  const spineScale = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section
      id="timeline"
      className="w-full overflow-x-clip px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="timeline-heading"
    >
      <motion.header
        className="mx-auto mb-20 flex w-full max-w-5xl flex-col gap-5"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: theme.inView.amount, once: theme.inView.once }}
      >
        <motion.p className="label-mono text-primary" variants={item}>
          2013–Now
        </motion.p>
        <motion.h2
          id="timeline-heading"
          className="max-w-[20ch] text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          variants={item}
        >
          Where I've worked, and what I built there.
        </motion.h2>
        <motion.p
          className="max-w-[56ch] text-base leading-relaxed text-muted-foreground"
          variants={item}
        >
          It starts in Chapel Hill. One track for where I was, one for what I
          was building at the time. Featured projects carry the full story:
          problem, approach, outcome.
        </motion.p>
      </motion.header>

      <div ref={bodyRef} className="relative mx-auto w-full max-w-5xl">
        {/* Spine: static rail + scroll-drawn progress. */}
        <div
          aria-hidden="true"
          className="absolute left-[7px] top-0 h-full w-px bg-border lg:left-1/2"
        >
          <motion.div
            className="absolute inset-0 origin-top bg-accent"
            style={{ scaleY: still ? 1 : spineScale }}
          />
        </div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {eras.map((era) => (
            <EraBlock key={era.id} era={era} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EraBlock({ era }: { era: TimelineEra }) {
  const { theme, still, calm, item } = useReveal()
  const ref = useRef<HTMLDivElement>(null)
  const parallaxAllowed = theme.motionMode === "full"

  // The project track drifts at a slightly different rate than the company
  // track, so the two columns read as parallel timelines.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  // Single array-keyframe hop onto a literal transform string keeps the
  // parallax hardware-accelerated (ScrollTimeline/WAAPI).
  const projectDrift = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxAllowed
      ? ["translateY(40px)", "translateY(-40px)"]
      : ["translateY(0px)", "translateY(0px)"]
  )

  const projects = era.projects ?? []
  const education = era.kind === "education"

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-1 gap-8 pl-10 lg:grid-cols-2 lg:gap-x-20 lg:pl-0"
    >
      {/* Era marker on the spine: work filled, education pale. */}
      <span
        aria-hidden="true"
        className={`absolute left-[7px] top-2 size-[15px] -translate-x-1/2 rounded-full border-2 border-accent lg:left-1/2 ${
          education ? "bg-accent-soft" : "bg-accent"
        }`}
      />

      {/* Company track. */}
      <div className="lg:pr-4">
        <motion.div
          className="top-28 flex flex-col gap-3 lg:sticky lg:text-right"
          variants={still ? undefined : item}
          initial={still ? false : "hidden"}
          whileInView={still ? undefined : "show"}
          viewport={{ amount: 0.6, once: theme.inView.once }}
        >
          <p className="label-mono text-primary">{era.years}</p>
          <h3 className="text-3xl font-semibold tracking-tight">
            {era.company}
          </h3>
          <p className="label-mono text-muted-foreground">{era.role}</p>
          <p className="max-w-[44ch] text-sm leading-relaxed text-muted-foreground lg:ml-auto">
            {era.summary}
          </p>
        </motion.div>
      </div>

      {/* Project track — education eras carry plain highlights, no card chrome. */}
      <motion.div
        className={`flex flex-col gap-6 lg:pl-4 ${education ? "lg:pt-2" : ""}`}
        style={{ transform: calm || still ? undefined : projectDrift }}
      >
        {education
          ? era.highlights?.map((highlight) => (
              <motion.p
                key={highlight}
                className="max-w-[46ch] text-sm leading-relaxed text-muted-foreground"
                variants={still ? undefined : item}
                initial={still ? false : "hidden"}
                whileInView={still ? undefined : "show"}
                viewport={{ amount: 0.3, once: theme.inView.once }}
              >
                {highlight}
              </motion.p>
            ))
          : projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
      </motion.div>
    </div>
  )
}

function ProjectCard({ project }: { project: TimelineProject }) {
  const { theme, still, item } = useReveal()
  const featured = Boolean(project.story)

  return (
    <motion.article
      className={`rounded-xl border border-border bg-card p-6 sm:p-7 ${
        featured
          ? "shadow-[0_1px_2px_rgba(28,27,23,0.04),0_8px_24px_-12px_rgba(28,27,23,0.12)]"
          : ""
      }`}
      variants={still ? undefined : item}
      initial={still ? false : "hidden"}
      whileInView={still ? undefined : "show"}
      viewport={{ amount: 0.3, once: theme.inView.once }}
    >
      <div className="flex flex-col gap-3">
        {featured && <span className="label-mono text-primary">Featured</span>}
        <h4 className="text-xl font-semibold tracking-tight">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-primary"
            >
              {project.title} ↗
            </a>
          ) : (
            project.title
          )}
        </h4>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>

        {project.story && (
          <dl className="mt-3 flex flex-col gap-4 border-t border-border pt-4">
            <StoryRow label="Problem" text={project.story.problem} />
            <StoryRow label="Approach" text={project.story.approach} />
            <StoryRow label="Outcome" text={project.story.outcome} />
          </dl>
        )}

        <ul className="mt-2 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="label-mono rounded-full border border-border px-3 py-1.5 text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  )
}

function StoryRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="label-mono text-faint">{label}</dt>
      <dd className="m-0 text-sm leading-relaxed">{text}</dd>
    </div>
  )
}
