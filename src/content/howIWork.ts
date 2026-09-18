// The "How I work" section: solving the user's problem first, agentic tooling as the how.

export const workStatement =
  "I use AI tools every day. This is how I keep them pointed at the right problem."

export interface WorkPrinciple {
  title: string
  body: string
}

export const workPrinciples: WorkPrinciple[] = [
  {
    title: "Start with the person using it",
    body: "It's easy to paste story requirements into Claude, scroll on your phone, and glance over a multi-thousand-line PR before merging. The hard part is pausing to ask whether the feature solves the user's problem in the way that makes the most sense to them. That takes curiosity, and no tool is going to be curious for you.",
  },
  {
    title: "Hand the repetitive work to AI",
    body: "I'm a huge advocate for using AI at what it was designed for: understanding protocols, following established patterns, and grinding through repetitive tasks. At Lowe's I learned agentic workflows and Snyk's MCP tooling, then taught both to the team, and our vulnerability resolution time dropped significantly.",
    // EDIT-ME: swap "significantly" for the real before/after if you have it.
  },
  {
    title: "Put the saved time into polish",
    body: "Agentic tools should buy us time to dive deeper into user journeys and put a level of polish on features that wasn't reasonably attainable before. I care more about delighting users than winning arguments about the 'perfect' architecture (though I promise I can hold my own in those too).",
  },
  {
    title: "Review generated code like any other code",
    body: "Generated code gets the same scrutiny as anything else: PR review, tests, security scanning, performance checks. Technical knowledge and experience still matter, and the absence of either comes back to bite you fast.",
  },
]
