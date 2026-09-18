// The resume PDF, built from src/content so it never drifts from the site.
// Emitted at site.resumePdf by the Vite plugin in vite.config.ts (and served
// live in dev), so there's no file to re-export and re-upload.
//
// Plain createElement instead of JSX, and relative imports with extensions,
// because vite.config.ts imports this file and the config has no JSX setup.

import {
  Document,
  Font,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer"
import { createElement as h, type ReactElement, type ReactNode } from "react"
import { site } from "../content/site.ts"
import { skillGroups } from "../content/skills.ts"
import { eras, type TimelineEra } from "../content/timeline.ts"

// No mid-word hyphenation ("compa-ny-wide"); wrap whole words only.
Font.registerHyphenationCallback((word) => [word])

// Carolina ink, the same --color-primary the site uses for text.
const ink = "#24689b"
const text = "#1f1f1f"
const muted = "#5c5c5c"

const styles = StyleSheet.create({
  page: {
    paddingVertical: 44,
    paddingHorizontal: 54,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.4,
    color: text,
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 22, lineHeight: 1.2, color: ink },
  role: { fontSize: 11, marginTop: 2 },
  contact: { marginTop: 4, color: muted },
  link: { color: muted, textDecoration: "none" },
  section: { marginTop: 14 },
  heading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: ink,
    borderBottomWidth: 0.75,
    borderBottomColor: ink,
    paddingBottom: 3,
    marginBottom: 6,
  },
  entry: { marginBottom: 8 },
  entryHead: { flexDirection: "row", justifyContent: "space-between" },
  bold: { fontFamily: "Helvetica-Bold" },
  dates: { color: muted },
  org: { color: muted, fontFamily: "Helvetica-Oblique" },
  bullet: { flexDirection: "row", marginTop: 2 },
  dot: { width: 10 },
  bulletText: { flex: 1 },
  line: { marginBottom: 2 },
})

const dateRange = (item: TimelineEra) => `${item.start} – ${item.end}`

/** `wrap: false` keeps a short section on one page instead of splitting it. */
function section(title: string, wrap: boolean, ...children: ReactNode[]): ReactElement {
  return h(
    View,
    { style: styles.section, wrap },
    h(Text, { style: styles.heading, minPresenceAhead: 30 }, title),
    ...children
  )
}

function bullet(key: string, ...content: ReactNode[]): ReactElement {
  return h(
    View,
    { key, style: styles.bullet, wrap: false },
    h(Text, { style: styles.dot }, "•"),
    h(Text, { style: styles.bulletText }, ...content)
  )
}

function entryHead(title: string, org: string, dates: string): ReactElement[] {
  return [
    h(
      View,
      { key: "head", style: styles.entryHead },
      h(Text, { style: styles.bold }, title),
      h(Text, { style: styles.dates }, dates)
    ),
    h(Text, { key: "org", style: styles.org }, org),
  ]
}

function job(item: TimelineEra): ReactElement {
  const bullets = [bullet("summary", item.summary)]
  item.projects?.forEach((project) => {
    // Most summaries already name the client; only add it when they don't.
    const client =
      project.client && !project.summary.includes(project.client)
        ? ` (${project.client})`
        : ""
    // Featured work adds the first line of its outcome (the Platinum Award,
    // the roadmap call). The rest of the story repeats the summary.
    const outcome =
      project.featured && project.story
        ? ` ${project.story.outcome.split(/(?<=\.) /)[0]}`
        : ""
    bullets.push(
      bullet(
        project.id,
        h(Text, { style: styles.bold }, `${project.title}${client}: `),
        project.summary + outcome
      )
    )
  })
  return h(
    View,
    { key: item.id, style: styles.entry },
    h(View, { wrap: false }, ...entryHead(item.role, item.company, dateRange(item)), bullets[0]),
    ...bullets.slice(1)
  )
}

function education(item: TimelineEra): ReactElement {
  return h(
    View,
    { key: item.id, style: styles.entry, wrap: false },
    ...entryHead(item.role, item.company, dateRange(item)),
    // Highlights (the SAS internship) stay on the site only.
    bullet("summary", item.summary)
  )
}

function resume(origin: string): ReactElement {
  const work = eras.filter((item) => item.kind !== "education").reverse()
  const schools = eras.filter((item) => item.kind === "education").reverse()

  const contact: [string, string][] = [
    [site.email, `mailto:${site.email}`],
    [site.linkedin.replace(/^https:\/\/(www\.)?/, ""), site.linkedin],
    [site.github.replace(/^https:\/\//, ""), site.github],
  ]
  if (origin) contact.push([origin.replace(/^https?:\/\//, ""), origin])

  return h(
    Document,
    { title: `${site.name} Resume`, author: site.name, subject: site.role },
    h(
      Page,
      { size: "LETTER", style: styles.page },
      h(Text, { style: styles.name }, site.name),
      h(Text, { style: styles.role }, site.role),
      h(
        Text,
        { style: styles.contact },
        site.location,
        ...contact.flatMap(([label, href]) => [
          "  •  ",
          h(Link, { key: href, src: href, style: styles.link }, label),
        ])
      ),
      section("Summary", false, h(Text, null, site.resumeSummary ?? site.hero.deck)),
      section("Experience", true, ...work.map(job)),
      section(
        "Skills",
        false,
        ...skillGroups.map((group) =>
          h(
            Text,
            { key: group.label, style: styles.line },
            h(Text, { style: styles.bold }, `${group.label}: `),
            group.items.join(", ")
          )
        )
      ),
      section("Education", false, ...schools.map(education))
    )
  )
}

/** Pass the site's origin to add it to the contact line (no domain yet). */
export function buildResumePdf(origin = ""): ReturnType<typeof renderToBuffer> {
  // The Document typing wants DocumentProps; our element is one, built by hand.
  return renderToBuffer(resume(origin) as Parameters<typeof renderToBuffer>[0])
}
