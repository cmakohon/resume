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
      className="w-full overflow-x-clip border-t border-border px-6 py-24 sm:px-10"
      aria-labelledby="about-heading"
    >
      <motion.div
        className="mx-auto grid w-full max-w-4xl grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.3, once: theme.inView.once }}
      >
        <div className="flex flex-col gap-6">
          <motion.h2
            id="about-heading"
            className="label-mono text-muted-foreground"
            variants={item}
          >
            Beyond the work
          </motion.h2>
          <motion.p
            className="text-pretty text-xl leading-relaxed sm:text-2xl sm:leading-relaxed"
            variants={item}
          >
            {site.personalNote}
          </motion.p>
        </div>

        {/* A printed photo, not a corporate avatar. */}
        <motion.div variants={item} className="shrink-0 sm:pt-12">
          {photoMissing ? (
            <div
              aria-hidden="true"
              className="flex size-36 rotate-2 items-center justify-center rounded-2xl bg-accent-soft font-mono text-2xl font-semibold text-primary"
            >
              CM
            </div>
          ) : (
            <img
              src="/headshot.jpg"
              alt={`Portrait of ${site.name}`}
              className="size-36 rotate-2 rounded-2xl border border-border object-cover shadow-[0_1px_2px_rgba(28,27,23,0.04),0_8px_24px_-12px_rgba(28,27,23,0.12)]"
              onError={() => setPhotoMissing(true)}
            />
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
