// The dual-track timeline: company eras on one track, the projects built
// during each era on the other. Chronological, 2013 → now.

export interface FeaturedStory {
  problem: string
  approach: string
  outcome: string
}

export interface TimelineProject {
  id: string
  title: string
  summary: string
  tech: string[]
  /** Featured projects get the full problem → approach → outcome treatment. */
  story?: FeaturedStory
  link?: string
}

export interface TimelineEra {
  id: string
  /** Defaults to "work". Education eras render highlights, not project cards. */
  kind?: "work" | "education"
  company: string
  role: string
  start: string
  end: string
  years: string
  summary: string
  projects?: TimelineProject[]
  /** Education-only: short lines that ride the project track without fake cards. */
  highlights?: string[]
}

export const eras: TimelineEra[] = [
  {
    id: "unc",
    kind: "education",
    company: "UNC Chapel Hill",
    role: "B.S. Computer Science",
    start: "Aug 2013",
    end: "May 2017",
    years: "2013–2017",
    summary:
      "Four years in Chapel Hill. It's where being curious about computers turned into something I could actually get paid for.",
    // EDIT-ME: drafted in Collin's voice. Confirm or replace with real UNC details.
    highlights: [
      "Learned pretty quickly that the hard part of programming was never the syntax. It was figuring out what the person asking actually needed.",
      "Four years of building things for class, then rebuilding them at 2am because they could be better (the perfectionism predates the career).",
      "Carolina blue has been my favorite color ever since. The accent on this site is not a coincidence.",
    ],
  },
  {
    id: "captech",
    company: "CapTech Ventures",
    role: "Senior Consultant / Developer Consultant",
    start: "Jul 2017",
    end: "Oct 2021",
    years: "2017–2021",
    summary:
      "Software development consulting for large financial and healthcare clients, designing tailored solutions from requirements through delivery.",
    projects: [
      {
        id: "deposit-exceptions",
        title: "Deposit exception processing engine",
        summary:
          "Led frontend development of a deposit exception engine at Bank of America; contributed REST endpoints and backend services.",
        tech: ["Angular 10", "NG-ZORRO", "Akita"],
      },
      {
        id: "foreign-item",
        title: "Foreign item reconciliation engine",
        summary:
          "Lead frontend developer on the rewrite of the engine processing every foreign check at Bank of America.",
        tech: ["Angular 6", "RxJS", "Spring Boot"],
      },
      {
        id: "premier-health",
        title: "Financial healthcare record management",
        summary:
          "Built a healthcare record management system at Premier Inc. alongside a team of 11 developers.",
        tech: ["Angular 6", "Java", "Spring", "Docker"],
      },
    ],
  },
  {
    id: "tbol",
    company: "TBOL Inc.",
    role: "Full Stack Developer",
    start: "Nov 2021",
    end: "Feb 2022",
    years: "2021–2022",
    summary:
      "Full stack development on a next-generation global payments platform for The Bank of London.",
    projects: [
      {
        id: "payments-platform",
        title: "Global payments platform",
        summary:
          "Implemented React/Redux UI from design mockups and built the foundation for a company-wide reusable component system with bit.dev.",
        tech: ["React", "Redux", "bit.dev"],
      },
    ],
  },
  {
    id: "bofa",
    company: "Bank of America",
    role: "Vice President, Software Engineer III",
    start: "Feb 2022",
    end: "Mar 2025",
    years: "2022–2025",
    summary:
      "Led a team of frontend developers building security tooling; established frontend thought leadership through presentations, mentoring, and best-practice evangelism.",
    projects: [
      {
        id: "cybersec-platform",
        title: "Cybersecurity operations platform",
        summary:
          "A React platform used daily by 100+ security analysts to research and respond to network threats.",
        tech: ["React", "Tailwind CSS", "OpenShift", "CI/CD"],
        story: {
          problem:
            "Security analysts needed a fast, reliable way to research and respond to network threats, and the existing on-prem proof of concept couldn't scale or ship safely.",
          approach:
            "Led the frontend team end to end: React + Tailwind architecture, a fully containerized OpenShift deployment replacing manual releases, and a CI/CD pipeline that made every release consistent across environments.",
          outcome:
            "Delivered to production within the fiscal year and recognized with a Platinum Award. 100+ analysts rely on it daily.",
        },
      },
    ],
  },
  {
    id: "lowes",
    company: "Lowe's Companies",
    role: "Senior Software Engineer",
    start: "Mar 2025",
    end: "Present",
    years: "2025–Now",
    summary:
      "IoT and RFID innovation for retail at scale. Fast POCs that still hold up to a real production review, and I'm the one who brought agentic tooling to the team.",
    projects: [
      {
        id: "rfid-poc",
        title: "RFID receiving-bay POC",
        summary:
          "Concept to fully functional demo in two weeks: real-time EPC→UPC mapping over Kafka streams with live visualization.",
        tech: ["React", "Kafka", "WebSockets", "Node.js"],
        story: {
          problem:
            "Leadership needed to see whether RFID receiving could work in a real store bay, and they needed to see it in time for roadmap decisions.",
          approach:
            "Independently designed the user flow, technical architecture, and demo experience: real-time EPC to UPC mapping, Kafka stream processing, item enrichment, and live visualization. Agentic tooling made the build fast, and everything still went through normal review.",
          outcome:
            "A fully functional POC inside two weeks of conceptualization, and it directly influenced product roadmap decisions.",
        },
      },
      {
        id: "iot-config",
        title: "IoT configuration platform rebuild",
        summary:
          "Turned a developer-only configuration tool into a product business users operate themselves.",
        tech: ["React", "TypeScript", "REST"],
        story: {
          problem:
            "Store configuration lived in a developer-only tool, so every business change routed through engineering and created support cycles that didn't need to exist.",
          approach:
            "Rebuilt the UI around the business user: self-service configuration management, with enough guardrails that self-service was actually safe.",
          outcome:
            "Business users manage store configurations independently; support cycles dropped accordingly.",
        },
      },
      {
        id: "digital-twin",
        title: "Digital Twin & 2D spatial visualization",
        summary:
          "BabylonJS digital-twin integrations for IoT POCs, plus a custom 2D spatial visualization tool built from scratch for RFID lab testing.",
        tech: ["BabylonJS", "React", "Canvas"],
        story: {
          problem:
            "The team's RFID lab work was blocked on visualization. With no way to see tag reads in space, there was no way to explore new use cases.",
          approach:
            "Integrated BabylonJS digital twins into multiple IoT POCs and built a bespoke 2D spatial visualization tool from scratch for lab testing.",
          outcome:
            "Unblocked the team's ability to explore new RFID use cases without delay.",
        },
      },
      {
        id: "cycle-count",
        title: "Mainframe cycle-count modernization",
        summary:
          "Sole UI developer modernizing a mainframe workflow; ran a half-day war room with stakeholders, and early demos drew praise from the Senior PM and VP.",
        tech: ["React", "TypeScript"],
      },
    ],
  },
]
