import { motion } from "motion/react"
import { useRef, useState } from "react"
import { useAmbient } from "@/components/ambient"
import { useReveal } from "@/components/reveal"
import { site } from "@/content/site"

export function About() {
  const { theme, still, container, item } = useReveal()
  // EDIT-ME: drop a headshot at public/headshot.jpg. Until then the photo
  // slot stays empty; a placeholder tile read as unfinished.
  const [photoMissing, setPhotoMissing] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const ambient = useAmbient(sectionRef)

  return (
    <section
      ref={sectionRef}
      {...ambient}
      id="about"
      className="w-full overflow-x-clip border-t border-border px-6 py-24 sm:px-10 sm:py-32"
      aria-labelledby="about-heading"
    >
      <motion.div
        className="mx-auto grid w-full max-w-5xl grid-cols-1 items-start gap-10 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-16"
        variants={still ? undefined : container}
        initial={still ? false : "hidden"}
        whileInView={still ? undefined : "show"}
        viewport={{ amount: 0.3, once: theme.inView.once }}
      >
        <div className="flex flex-col gap-6">
          <motion.h2
            id="about-heading"
            className="label-mono text-primary"
            variants={item}
          >
            About · Beyond the work
          </motion.h2>
          <motion.p
            className="max-w-[46ch] text-pretty text-xl leading-relaxed sm:text-2xl sm:leading-relaxed"
            variants={item}
          >
            {site.personalNote}
          </motion.p>
        </div>

        {/* A printed photo, not a corporate avatar. It sways a little on
            its pin. */}
        {!photoMissing && (
          <motion.div variants={item} className="shrink-0 sm:pt-12">
            <div className="ambient-sway origin-top">
              <img
                src="/headshot.jpg"
                alt={`Portrait of ${site.name}`}
                className="size-36 rotate-2 rounded-2xl border border-border object-cover shadow-(--card-shadow)"
                onError={() => setPhotoMissing(true)}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
