import { motion } from "motion/react"
import { useState } from "react"
import { useReveal } from "@/components/reveal"
import { site } from "@/content/site"

export function About() {
  const { theme, still, container, item } = useReveal()
  // EDIT-ME: drop a headshot at public/headshot.jpg; initials render until then.
  const [photoMissing, setPhotoMissing] = useState(false)

  return (
    <section
      id="about"
      className="w-full overflow-x-clip px-6 py-24 sm:px-10"
      aria-labelledby="about-heading"
    >
      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.4, once: theme.inView.once }}
      >
        <motion.div variants={item} className="shrink-0">
          {photoMissing ? (
            <div
              aria-hidden="true"
              className="flex size-32 items-center justify-center rounded-full bg-accent-soft font-mono text-2xl font-semibold text-primary"
            >
              CM
            </div>
          ) : (
            <img
              src="/headshot.jpg"
              alt={`Portrait of ${site.name}`}
              className="size-32 rounded-full border border-border object-cover"
              onError={() => setPhotoMissing(true)}
            />
          )}
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.h2
            id="about-heading"
            className="label-mono text-muted-foreground"
            variants={item}
          >
            Beyond the work
          </motion.h2>
          <motion.p
            className="text-lg leading-relaxed"
            variants={item}
          >
            {site.personalNote}
          </motion.p>
          <motion.p className="label-mono text-faint" variants={item}>
            B.S. Computer Science · UNC Chapel Hill
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
