// Personal projects: apps built on my own time, living in their own stores.
// Kept out of the timeline on purpose so the career reads as one line.

export const projectsIntro =
  "Two apps I'm building because I wanted them to exist. Neither is out yet. When one ships, the link goes here."

export type ProjectStatus = "Live" | "In beta" | "In progress"

export interface PersonalProject {
  id: string
  name: string
  /** Mono kicker: what kind of thing it is and where it lives. */
  platform: string
  /** Rendered next to the platform, so nobody clicks a link that isn't there yet. */
  status: ProjectStatus
  /** One line under the name. */
  tagline: string
  /** Two to four sentences, Collin's voice. */
  body: string
  tech: string[]
  /** The marketplace listing. Only rendered once the project is live. */
  store?: { label: string; href: string }
}

// EDIT-ME: drafted from one-line descriptions. Confirm the status, the tech
// tags (best guesses), and what each app does today. Add `store` only when
// the listing URL is real.
export const projects: PersonalProject[] = [
  {
    id: "dexflip",
    name: "DexFlip",
    platform: "iOS app",
    status: "In progress",
    tagline: "Scan a Pokémon card, get it listed on eBay.",
    body:
      "I collect Pokémon cards (it's in the About section, I'm not hiding it), and listing them on eBay one at a time is miserable: find the set, find the card number, type a title, guess at a price. DexFlip is a native iOS app that identifies the card from the camera, pulls what it has been selling for, and builds the listing for you.",
    tech: ["Swift", "SwiftUI", "Vision", "eBay API"],
  },
  {
    id: "tradepost",
    name: "TradePost",
    platform: "Reddit app",
    status: "In progress",
    tagline: "Buy, sell, and trade without leaving the subreddit.",
    body:
      "Buy/sell/trade communities on Reddit mostly run on comment threads and a lot of trust in the mods. TradePost is a Devvit app that gives those communities proper listings and trade confirmations inside Reddit itself, so members have a record of what happened and mods spend less time refereeing.",
    tech: ["Devvit", "TypeScript", "Redis", "Reddit API"],
  },
]
