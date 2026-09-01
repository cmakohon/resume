// The "How I work" section: solving the user's problem first, agentic tooling as the how.

export const workStatement =
  "Agentic tools level the playing field. Products still live or die on how well the people behind them understand the problem they're trying to solve."

export interface WorkPrinciple {
  title: string
  body: string
}

export const workPrinciples: WorkPrinciple[] = [
  {
    title: "Put yourself in the user's shoes",
    body: "It's easy to paste story requirements into Claude, scroll on your phone, and glance over a multi-thousand-line PR before merging. The hard part is pausing to ask whether the feature solves the user's problem in the way that makes the most sense to them. That takes curiosity, and no tool is going to be curious for you.",
  },
  {
    title: "Let AI do the boring parts",
    body: "I'm a huge advocate for using AI at what it was designed for: understanding protocols, following established patterns, and grinding through repetitive tasks. At Lowe's I championed agentic workflows and taught them to the team, and vulnerability resolution time dropped measurably.",
  },
  {
    title: "Spend the savings on polish",
    body: "Agentic tools should buy us time to dive deeper into user journeys and put a level of polish on features that wasn't reasonably attainable before. I care more about delighting users than winning arguments about the 'perfect' architecture (though I promise I can hold my own in those too).",
  },
  {
    title: "Review like a human wrote it",
    body: "Generated code gets the same scrutiny as anything else: PR review, tests, security scanning, performance checks. Technical knowledge and experience still matter, and the absence of either comes back to bite you fast. I review it the same whether a person wrote it or a model did.",
  },
]
