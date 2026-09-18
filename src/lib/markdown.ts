// The whole site as Markdown, built from src/content so there's nothing to
// keep in sync by hand. Feeds /llms.txt, /llms-full.txt (emitted by the Vite
// plugin in vite.config.ts), and the hero's "Copy as Markdown" button.
//
// Relative imports with extensions on purpose: vite.config.ts imports this
// file too, and the config is type-checked as Node ESM without the @ alias.

import { lookingForGroups, lookingForIntro } from "../content/lookingFor.ts"
import { workPrinciples, workStatement } from "../content/howIWork.ts"
import { projects, projectsIntro } from "../content/projects.ts"
import { site } from "../content/site.ts"
import { skillGroups } from "../content/skills.ts"
import { eras, type TimelineEra } from "../content/timeline.ts"

const navLabel = (id: string) =>
  site.nav.find((item) => item.id === id)?.label ?? id

const summary = `${site.role} in ${site.location}. ${site.hero.headline}`

function contact(origin: string): string[] {
  return [
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Resume (PDF): ${origin}${site.resumePdf}`,
  ]
}

function era(item: TimelineEra): string[] {
  const lines = [
    `### ${item.company}: ${item.role} (${item.years})`,
    "",
    `${item.start} to ${item.end}. ${item.summary}`,
  ]
  item.highlights?.forEach((highlight) => lines.push("", `- ${highlight}`))
  item.projects?.forEach((project) => {
    lines.push("", `#### ${project.title}`, "")
    if (project.client) lines.push(`Client: ${project.client}`, "")
    lines.push(project.summary)
    if (project.story) {
      lines.push(
        "",
        `- Problem: ${project.story.problem}`,
        `- Approach: ${project.story.approach}`,
        `- Outcome: ${project.story.outcome}`
      )
    }
    lines.push("", `Tech: ${project.tech.join(", ")}`)
    if (project.link) lines.push("", `Link: ${project.link}`)
  })
  return lines
}

/**
 * Everything on the page, in page order. Pass the site's origin to make
 * site-relative links absolute (the build doesn't know the domain yet).
 */
export function buildFullMarkdown(origin = ""): string {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${summary}`,
    "",
    site.hero.deck,
    "",
    site.hero.subline,
    "",
    "## Contact",
    "",
    ...contact(origin),
    "",
    `## ${navLabel("timeline")}`,
    "",
    "Newest first.",
  ]

  // Same order as the page: newest first.
  ;[...eras].reverse().forEach((item) => lines.push("", ...era(item)))

  lines.push(
    "",
    `## ${navLabel("how-i-work")}`,
    "",
    workStatement,
    ""
  )
  workPrinciples.forEach((principle, index) =>
    lines.push(`${index + 1}. **${principle.title}.** ${principle.body}`)
  )

  lines.push("", `## ${navLabel("skills")}`, "")
  skillGroups.forEach((group) =>
    lines.push(`- **${group.label}:** ${group.items.join(", ")}`)
  )

  lines.push("", `## ${navLabel("projects")}`, "", projectsIntro)
  projects.forEach((project) => {
    lines.push(
      "",
      `### ${project.name}`,
      "",
      `${project.platform} (${project.status}). ${project.tagline}`,
      "",
      project.body,
      "",
      `Tech: ${project.tech.join(", ")}`
    )
    if (project.store) {
      lines.push("", `[${project.store.label}](${project.store.href})`)
    }
  })

  lines.push("", `## ${navLabel("about")}`, "", site.personalNote)

  lines.push("", "## What I'm looking for", "", lookingForIntro)
  lookingForGroups.forEach((group) =>
    lines.push("", `### ${group.title}`, "", group.body)
  )

  return lines.join("\n") + "\n"
}

/** The llms.txt index (llmstxt.org): a summary plus links to the full text. */
export function buildLlmsTxt(): string {
  return [
    `# ${site.name}`,
    "",
    `> ${summary}`,
    "",
    site.hero.deck,
    "",
    "## Site",
    "",
    "- [Full site as Markdown](/llms-full.txt): work history, how I work, toolbox, personal projects, about me, and what I'm looking for",
    "- [Home page](/): the same content as a web page",
    "",
    "## Optional",
    "",
    `- [Resume (PDF)](${site.resumePdf})`,
    `- [GitHub](${site.github})`,
    `- [LinkedIn](${site.linkedin})`,
    `- [Email](mailto:${site.email})`,
    "",
  ].join("\n")
}
