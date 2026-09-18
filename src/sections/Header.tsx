import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"
import { site } from "@/content/site"

/** Full class strings so Tailwind sees them. */
const SHOW_FROM = {
  base: undefined,
  // Below 360px the name, two links, and the toggle overflow the bar.
  xs: "hidden min-[360px]:block",
  sm: "hidden sm:block",
  lg: "hidden lg:block",
} as const

/** `contact` lives inside the sticky footer, so it never gets an active state. */
const SPIED = site.nav.filter((item) => item.id !== "contact")

/**
 * Fixed banner: the name stays visible for the whole page, jump links ride
 * alongside it. Transparent over the hero, opaque once the page moves under it.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const sections = SPIED.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    // A thin band across the middle of the viewport: whatever crosses it is
    // current. Tracking the whole set means the hero and footer clear it again.
    const inBand = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) inBand.add(entry.target.id)
          else inBand.delete(entry.target.id)
        })
        setActiveId(SPIED.find((item) => inBand.has(item.id))?.id ?? null)
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b px-6 transition-colors duration-300 sm:px-10 ${
        scrolled
          ? "border-border bg-background"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Same measure as the sections below, so the accent rule sits on their grid. */}
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 py-4">
        <a
          href="#top"
          className="flex shrink-0 items-center gap-3 text-[0.9375rem] font-semibold tracking-tight transition-colors hover:text-primary"
        >
          <span aria-hidden="true" className="h-0.5 w-4 bg-accent" />
          {site.name}
        </a>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Sections">
            <ul className="label-mono m-0 flex list-none items-center gap-4 p-0 sm:gap-6">
              {site.nav.map((item) => (
                <li
                  key={item.id}
                  className={SHOW_FROM[item.from]}
                >
                  <a
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? "location" : undefined}
                    className={`transition-colors hover:text-foreground ${
                      activeId === item.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
