// Single source of truth for everything the page renders.
// Anything marked EDIT-ME needs Collin's input before launch.

export const site = {
  name: "Collin Makohon",
  role: "Senior Software Engineer",
  location: "Charlotte, NC",
  email: "cmakohon@me.com",
  github: "https://github.com/cmakohon",
  // EDIT-ME: real LinkedIn URL
  linkedin: "https://www.linkedin.com/in/collinmakohon",
  resumePdf: "/CollinMakohonResume2026.pdf",
  /** Header jump links. Each `id` matches a section's DOM id. */
  nav: [
    { id: "timeline", label: "Work" },
    { id: "projects", label: "Projects" },
    { id: "how-i-work", label: "How I work" },
    { id: "skills", label: "Toolbox" },
    { id: "about", label: "About" },
    { id: "looking-for", label: "Looking for" },
    { id: "contact", label: "Contact" },
  ],
  hero: {
    headline: "I love solving problems for people.",
    deck: "Senior software engineer. Banking, healthcare, and now retail.",
    subline:
      "For nine-plus years, software has been how I do it. The tools keep changing (I do miss hunting for the perfect CSS property), but the goal hasn't: build things that make someone's day a little better.",
    /** Mono credential strip under the calls to action. Chronological. */
    credentials: ["9+ years", "CapTech", "Bank of America", "Lowe's"],
  },
  // EDIT-ME: headshot at /public/headshot.jpg
  personalNote:
    "I'm a husband and a father, and I love spending time with my family. I've lived in Charlotte my whole life, and you'll find us at the White Water Center most warm weekends. Off the clock it's video games, playing music, Pokémon, 3D printing, fantasy football, and board games. I'm a perfectionist by nature, and I have a hard time turning my brain off when there's a problem left to solve.",
} as const
