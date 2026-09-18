export interface SkillGroup {
  label: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Frontend",
    items: [
      "React",
      "TypeScript",
      "JavaScript",
      "Next.js",
      "Vite",
      "Redux",
      "Angular",
      "Tailwind CSS",
      "HTML & CSS",
      "Motion",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express",
      "Java",
      "Spring Boot",
      "REST APIs",
      "SQL",
      "PostgreSQL",
      "Oracle",
      "Kafka",
    ],
  },
  {
    label: "DevOps & Infra",
    items: [
      "Docker",
      "Kubernetes",
      "OpenShift",
      "Jenkins",
      "GitHub Actions",
      "CI/CD",
      "Unix",
    ],
  },
  {
    label: "AI tooling",
    // EDIT-ME: add any other MCP servers you've wired up at work.
    items: ["Claude Code", "Snyk MCP", "GitHub Copilot", "Windsurf"],
  },
]
