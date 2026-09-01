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
      "Next.js",
      "Vite",
      "Redux",
      "Angular",
      "Tailwind CSS",
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
    label: "Agentic Engineering",
    items: [
      "Claude Code",
      "MCP integrations",
      "AI-assisted workflows",
      "Agentic task automation",
      "LLM tooling pipelines",
    ],
  },
]
