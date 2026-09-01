import { FooterRevealFooter } from "@/components/motion-ui/footer-reveal"
import { site } from "@/content/site"

/** Sticky under-page footer, revealed as the page scrolls off it. Dark for a decisive close. */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <FooterRevealFooter className="bg-foreground text-background">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex flex-col gap-6">
          <p className="label-mono text-background/60">Get in touch</p>
          <a
            href={`mailto:${site.email}`}
            className="max-w-fit text-balance text-4xl font-semibold tracking-tight transition-colors hover:text-accent sm:text-6xl"
          >
            Let's talk.
          </a>
          <p className="max-w-[44ch] text-sm leading-relaxed text-background/70">
            Looking for Senior, Staff, or Lead roles with a team solving real
            problems. Email is the fastest way to reach me. The resume has the
            rest.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={`mailto:${site.email}`}
            className="label-mono text-background/80 transition-colors hover:text-background"
          >
            {site.email}
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="label-mono text-background/80 transition-colors hover:text-background"
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="label-mono text-background/80 transition-colors hover:text-background"
          >
            LinkedIn
          </a>
          <a
            href={site.resumePdf}
            download
            className="label-mono text-background/80 transition-colors hover:text-background"
          >
            Resume (PDF)
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <p className="label-mono text-background/40">
            Every word here was written by a human. The site itself was built
            with the agentic tooling it talks about.
          </p>
          <p className="label-mono text-background/40">
            © {year} {site.name} · {site.location}
          </p>
        </div>
      </div>
    </FooterRevealFooter>
  )
}
