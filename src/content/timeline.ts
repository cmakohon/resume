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
    summary: "Graduated with a 3.78 GPA.",
    // EDIT-ME: optional. One real line (a class, a project, a job on campus)
    // renders on the project track. Leave empty and the era stays one line.
    highlights: [],
  },
  {
    id: "captech",
    company: "CapTech Ventures",
    role: "Senior Consultant / Developer Consultant",
    start: "Jul 2017",
    end: "Oct 2021",
    years: "2017–2021",
    summary:
      "Consulting for large banking and healthcare clients, from requirements through delivery.",
    projects: [
      {
        id: "deposit-exceptions",
        title: "Deposit exception processing engine",
        summary:
          "Led the frontend for a deposit exception processing engine at Bank of America, and pitched in on the REST endpoints and backend services.",
        tech: ["Angular 10", "NG-ZORRO", "Akita"],
      },
      {
        id: "foreign-item",
        title: "Foreign item reconciliation engine",
        summary:
          "Lead frontend developer on the rewrite of the engine that processes every foreign check Bank of America receives.",
        tech: ["Angular 6", "RxJS", "Spring Boot"],
      },
      {
        id: "premier-health",
        title: "Financial healthcare record management",
        summary:
          "Built a healthcare record management system at Premier Inc. on a team of 11 developers.",
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
    // EDIT-ME: add one honest sentence on why this stint was short (three
    // months). Every recruiter will ask, so answer it here.
    summary:
      "Full stack work on a next-generation global payments platform for The Bank of London.",
    projects: [
      {
        id: "payments-platform",
        title: "Global payments platform",
        summary:
          "Built React/Redux screens from design mockups, and laid the groundwork for a company-wide shared component library on bit.dev.",
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
    // EDIT-ME: how many developers did you lead? "Led a team of N frontend
    // developers" reads a lot stronger than "a team".
    summary:
      "Led a team of frontend developers building security tooling. I also gave internal talks on frontend and mentored the developers around me.",
    projects: [
      {
        id: "cybersec-platform",
        title: "Cybersecurity operations platform",
        summary:
          "A React platform that 100+ security analysts use every day to research and respond to network threats.",
        tech: ["React", "Tailwind CSS", "OpenShift", "CI/CD"],
        story: {
          problem:
            "Security analysts needed a fast, reliable way to research and respond to network threats. What existed was an on-prem proof of concept that couldn't scale and couldn't ship safely.",
          approach:
            "I led the frontend team: React and Tailwind for the app, a fully containerized OpenShift deployment in place of manual releases, and a CI/CD pipeline so every environment got the same release.",
          // EDIT-ME: what is a Platinum Award, and how many people get one?
          // A few words of context ("one of N across the org") makes it land.
          outcome:
            "Shipped to production inside the fiscal year and won a Platinum Award. 100+ analysts use it every day.",
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
      "IoT and RFID work for retail at scale, mostly quick proofs of concept that still have to pass a normal production review. I'm the one who brought agentic tooling to the team.",
    projects: [
      {
        id: "rfid-poc",
        title: "RFID receiving-bay POC",
        summary:
          "Idea to working demo in two weeks: real-time EPC to UPC mapping over Kafka streams, with live visualization.",
        tech: ["React", "Kafka", "WebSockets", "Node.js"],
        story: {
          problem:
            "Leadership needed to see whether RFID receiving could work in a real store bay, and they needed to see it in time for roadmap decisions.",
          approach:
            "I designed the user flow, the architecture, and the demo myself: EPC to UPC mapping in real time, Kafka stream processing, item enrichment, and live visualization. Agentic tooling made the build fast, and the code still went through normal review.",
          outcome:
            "A working POC two weeks after the idea came up, and it fed straight into product roadmap decisions.",
        },
      },
      {
        id: "iot-config",
        title: "IoT configuration platform rebuild",
        summary:
          "Turned a developer-only configuration tool into something business users run themselves.",
        tech: ["React", "TypeScript", "REST"],
        story: {
          problem:
            "Store configuration lived in a tool only developers could use, so every business change had to go through engineering.",
          approach:
            "I rebuilt the UI around the business user, with enough guardrails that letting them change store configurations on their own was safe.",
          // EDIT-ME: a number here (requests per month before and after, or
          // how many business users) would make this the strongest story.
          outcome:
            "Business users manage store configurations on their own now, and fewer of those requests land on engineering.",
        },
      },
      {
        id: "digital-twin",
        title: "Digital Twin & 2D spatial visualization",
        summary:
          "BabylonJS digital twins for IoT POCs, plus a 2D spatial visualization tool I built from scratch for RFID lab testing.",
        tech: ["BabylonJS", "React", "Canvas"],
        story: {
          problem:
            "The RFID lab had no way to see where tags were being read, so exploring new use cases was stuck.",
          approach:
            "Integrated BabylonJS digital twins into several IoT POCs, and built a 2D spatial visualization tool from scratch for lab testing.",
          outcome:
            "The lab could start exploring new RFID use cases instead of waiting on tooling.",
        },
      },
      {
        id: "cycle-count",
        title: "Mainframe cycle-count modernization",
        summary:
          "Sole UI developer modernizing a mainframe cycle-count workflow. I ran a half-day war room with business stakeholders to pin down requirements, and the early demos got good feedback from the Senior PM and VP.",
        tech: ["React", "TypeScript"],
      },
    ],
  },
]
