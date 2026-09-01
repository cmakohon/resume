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
  hero: {
    headline: "I love solving problems for people.",
    subline:
      "For nine-plus years, software has been how I do it. The tools keep changing (I do miss hunting for the perfect CSS property), but the goal hasn't: build things that make someone's day a little better.",
  },
  // EDIT-ME: headshot at /public/headshot.jpg
  personalNote:
    "I'm a husband and a father, and I love spending time with my family. I've lived in Charlotte my whole life, and you'll find us at the White Water Center most warm weekends. Off the clock it's video games, playing music, Pokémon, 3D printing, fantasy football, and board games. I'm a perfectionist by nature, and I have a hard time turning my brain off when there's a problem left to solve.",
} as const
