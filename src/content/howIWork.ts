// The "How I work" section: agentic workflow framed as engineering process.

export const workStatement =
  "Agentic tools don't replace engineering judgment — they compound it. Nine years of production discipline goes into every spec, every prompt, and every review."

export interface WorkPrinciple {
  title: string
  body: string
}

export const workPrinciples: WorkPrinciple[] = [
  {
    title: "Spec before speed",
    body: "Agents amplify whatever you hand them — including ambiguity. I write the requirements, constraints, and acceptance criteria first, the same way I'd brief an engineer. Clear specs are why my agentic work ships instead of stalling in rework.",
  },
  {
    title: "Tooling as a force multiplier",
    body: "At Lowe's I championed AI-assisted development and built Snyk MCP automation workflows — then taught them to the broader team. Vulnerability resolution time dropped measurably. The win wasn't the tool; it was the workflow design around it.",
  },
  {
    title: "Review is non-negotiable",
    body: "Generated code gets the same scrutiny as human code: PR review, tests, security scanning, performance checks. I've led frontend teams at a top-tier bank — the bar doesn't move because the author was a model.",
  },
  {
    title: "Ship, verify, then trust",
    body: "Velocity claims are cheap. A two-week concept-to-demo RFID POC and a production security platform delivered inside a fiscal year are what agentic speed looks like when it's grounded in delivery discipline.",
  },
]
