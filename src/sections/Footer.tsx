import { useMotionValueEvent } from "motion/react"
import { useState } from "react"
import {
  FooterRevealFooter,
  useFooterRevealProgress,
} from "@/components/motion-ui/footer-reveal"
import { RisingDots } from "@/components/RisingDots"
import { site } from "@/content/site"

/** Sticky under-page footer, revealed as the page scrolls off it. A deep surface in both themes, for a decisive close. */
export function Footer() {
  const year = new Date().getFullYear()

  // The footer is sticky, so it always counts as on screen even while the
  // page covers it. Its dots run only once the reveal has started.
  const reveal = useFooterRevealProgress()
  const [uncovered, setUncovered] = useState(() => reveal.get() > 0)
  useMotionValueEvent(reveal, "change", (progress) => setUncovered(progress > 0))

  return (
    <FooterRevealFooter
      className="bg-footer text-footer-foreground dark:border-t dark:border-border"
      backdrop={<RisingDots tone="footer" seed={9} active={uncovered} />}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex flex-col gap-6">
          <p className="label-mono flex items-center gap-3 text-accent">
            <span aria-hidden="true" className="h-0.5 w-8 bg-accent" />
            Get in touch
          </p>
          <a
            href={`mailto:${site.email}`}
            className="max-w-fit text-balance text-4xl font-semibold tracking-tight transition-colors hover:text-accent sm:text-6xl"
          >
            Let's talk.
          </a>
          <p className="max-w-[44ch] text-sm leading-relaxed text-footer-foreground/70">
            Looking for Senior, Staff, or Lead roles with a team solving real
            problems. Email is the fastest way to reach me. The resume has the
            rest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={`mailto:${site.email}`}
            className="label-mono text-footer-foreground/80 transition-colors hover:text-accent"
          >
            {site.email}
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="label-mono text-footer-foreground/80 transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="label-mono text-footer-foreground/80 transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={site.resumePdf}
            download
            className="label-mono text-footer-foreground/80 transition-colors hover:text-accent"
          >
            Resume (PDF)
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <p className="label-mono text-footer-foreground/40">
            Every word here was written by a human. The site itself was built
            with the agentic tooling it talks about.
          </p>
          <p className="label-mono text-footer-foreground/40">
            © {year} {site.name} · {site.location}
          </p>
        </div>
      </div>
    </FooterRevealFooter>
  )
}
