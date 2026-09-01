import {
  FooterReveal,
  FooterRevealContent,
} from "@/components/motion-ui/footer-reveal"
import { MotionUIThemeProvider } from "@/components/motion-ui/ui-theme"
import siteTheme from "@/motion.theme"
import { About } from "@/sections/About"
import { Footer } from "@/sections/Footer"
import { Hero } from "@/sections/Hero"
import { HowIWork } from "@/sections/HowIWork"
import { LookingFor } from "@/sections/LookingFor"
import { Skills } from "@/sections/Skills"
import { Stats } from "@/sections/Stats"
import { Timeline } from "@/sections/Timeline"

export default function App() {
  return (
    <MotionUIThemeProvider theme={siteTheme}>
      <FooterReveal>
        <FooterRevealContent>
          <main>
            <Hero />
            <Stats />
            <Timeline />
            <HowIWork />
            <Skills />
            <About />
            <LookingFor />
          </main>
        </FooterRevealContent>
        <Footer />
      </FooterReveal>
    </MotionUIThemeProvider>
  )
}
