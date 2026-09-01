// Single source of truth for everything the page renders.
// Anything marked EDIT-ME needs Collin's input before launch.

export const site = {
  name: "Collin Makohon",
  role: "Senior Software Engineer",
  location: "Charlotte, NC",
  email: "cmakohon@me.com",
  // EDIT-ME: real profile URLs
  github: "https://github.com/collinmakohon",
  linkedin: "https://www.linkedin.com/in/collinmakohon",
  resumePdf: "/CollinMakohonResume2026.pdf",
  hero: {
    headline: "Software engineer, nine years deep.",
    subline:
      "I ship production systems at agentic speed — without skipping the engineering. React and TypeScript on the surface, Kafka and Kubernetes underneath, and a decade of discipline in every pull request.",
  },
  // EDIT-ME: personal note + headshot at /public/headshot.jpg
  personalNote:
    "Based in Charlotte, NC. When I'm not shipping software I'm usually exploring new tooling, mentoring engineers, or finding out what the latest model can really do under production constraints.",
} as const

import type { NumberFormat } from "@/components/motion-ui/animated-number"

export interface Stat {
  label: string
  value: number
  suffix?: string
  format?: NumberFormat
}

export const stats: Stat[] = [
  { label: "Years shipping production software", value: 9, suffix: "+" },
  { label: "Security analysts using my team's platform daily", value: 100, suffix: "+" },
  { label: "Days from concept to live RFID demo", value: 14 },
  { label: "Enterprise employers across fintech & retail", value: 4 },
]
