import { useEffect, useState } from "react"
import { buildFullMarkdown } from "@/lib/markdown"

const RESET_AFTER_MS = 2000

/** Copies the whole site as Markdown, for pasting into an LLM. Styled like the mono links around it. */
export function CopyMarkdown() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), RESET_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(buildFullMarkdown(window.location.origin))
      setCopied(true)
    } catch {
      // No clipboard access (insecure context, denied permission): show the file instead.
      window.open("/llms-full.txt", "_blank", "noopener")
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-grid cursor-pointer justify-items-start uppercase transition-colors hover:text-primary"
    >
      {/* Both labels share one cell so the row doesn't shift when they swap. */}
      <span className={`col-start-1 row-start-1 ${copied ? "invisible" : ""}`}>
        Copy as Markdown
      </span>
      <span
        aria-hidden="true"
        className={`col-start-1 row-start-1 ${copied ? "text-primary" : "invisible"}`}
      >
        Copied
      </span>
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  )
}
