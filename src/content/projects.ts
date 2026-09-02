// Personal projects: apps built on my own time, living in their own stores.
// Kept out of the timeline on purpose so the career reads as one line.

export const projectsIntro =
  "Two apps I built because I wanted them to exist. Both live where you'd expect to find them, and both are still getting updates."

export interface PersonalProject {
  id: string
  name: string
  /** Mono kicker: what kind of thing it is and where it lives. */
  platform: string
  /** One line under the name. */
  tagline: string
  /** Two to four sentences, Collin's voice. */
  body: string
  tech: string[]
  /** The marketplace listing. Opens in a new tab. */
  store: { label: string; href: string }
}

// EDIT-ME: drafted from one-line descriptions. Confirm the store URLs, the
// tech tags (best guesses), and any claim about what each app actually does.
export const projects: PersonalProject[] = [
  {
    id: "dexflip",
    name: "DexFlip",
    platform: "iOS app",
    tagline: "Scan a Pokémon card, get it listed on eBay.",
    body:
      "I collect Pokémon cards (it's in the About section, I'm not hiding it), and listing them on eBay one at a time is miserable: find the set, find the card number, type a title, guess at a price. DexFlip is a native iOS app that identifies the card from the camera, pulls what it has actually been selling for, and builds the listing for you.",
    tech: ["Swift", "SwiftUI", "Vision", "eBay API"],
    store: {
      label: "App Store",
      href: "https://apps.apple.com/app/dexflip/id0000000000",
    },
  },
  {
    id: "tradepost",
    name: "TradePost",
    platform: "Reddit app",
    tagline: "Buy, sell, and trade without leaving the subreddit.",
    body:
      "Buy/sell/trade communities on Reddit mostly run on comment threads and a lot of trust in the mods. TradePost is a Devvit app that gives those communities real listings and trade confirmations inside Reddit itself, so members have a record of what happened and mods spend less time refereeing.",
    tech: ["Devvit", "TypeScript", "Redis", "Reddit API"],
    store: {
      label: "Reddit Developer Platform",
      href: "https://developers.reddit.com/apps/tradepost",
    },
  },
]
