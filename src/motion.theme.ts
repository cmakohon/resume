import { defineTheme } from "@/components/motion-ui/ui-theme"

// "Choreographed but calm": restrained, decisive motion. Tighter staggers and
// shorter travel than the Motion UI default so reveals read as precision, not
// spectacle.
export default defineTheme({
  transitions: {
    snap: { stiffness: 1400, damping: 80 },
    ui: { stiffness: 390, damping: 40 },
    gentle: { stiffness: 150, damping: 27 },
    lively: { stiffness: 700, damping: 33 },
    ambient: { stiffness: 55, damping: 16 },
  },
  stagger: { tight: 0.03, base: 0.06, relaxed: 0.11 },
  travel: { hover: 2, enter: 16, section: 32 },
  inView: { amount: 0.4, once: true },
  reducedMotion: "calm",
})
