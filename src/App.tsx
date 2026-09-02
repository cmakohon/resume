import {
  FooterReveal,
  FooterRevealContent,
} from "@/components/motion-ui/footer-reveal"
import { MotionUIThemeProvider } from "@/components/motion-ui/ui-theme"
import siteTheme from "@/motion.theme"
import { About } from "@/sections/About"
import { Footer } from "@/sections/Footer"
import { Header } from "@/sections/Header"
import { Hero } from "@/sections/Hero"
import { HowIWork } from "@/sections/HowIWork"
import { LookingFor } from "@/sections/LookingFor"
import { Projects } from "@/sections/Projects"
import { Skills } from "@/sections/Skills"
import { Timeline } from "@/sections/Timeline"

export default function App() {
  return (
    <MotionUIThemeProvider theme={siteTheme}>
      {/* Outside FooterReveal so the banner floats above the revealed footer too. */}
      <Header />
      <FooterReveal>
        <FooterRevealContent>
          <main>
            <Hero />
            <Timeline />
            <Projects />
            <HowIWork />
            <Skills />
            <About />
            <LookingFor />
          </main>
          {/* Contact jump target. The footer is sticky *behind* this layer, so
              the scroll that uncovers it is the one that ends the content. */}
          <div id="contact" aria-hidden="true" />
        </FooterRevealContent>
        <Footer />
      </FooterReveal>
    </MotionUIThemeProvider>
  )
}
