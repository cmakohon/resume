import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { site } from './src/content/site.ts'
import { buildFullMarkdown, buildLlmsTxt } from './src/lib/markdown.ts'
import { buildResumePdf } from './src/lib/resume.ts'

type MarkdownModule = typeof import('./src/lib/markdown.ts')
type ResumeModule = typeof import('./src/lib/resume.ts')

/** /llms.txt and /llms-full.txt, generated from src/content. */
function llmsTxt(): Plugin {
  const files = (md: MarkdownModule): Record<string, string> => ({
    'llms.txt': md.buildLlmsTxt(),
    'llms-full.txt': md.buildFullMarkdown(),
  })

  return {
    name: 'llms-txt',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const name = req.url?.split('?')[0].slice(1)
        if (name !== 'llms.txt' && name !== 'llms-full.txt') return next()
        try {
          // Loaded per request so content edits show up without a restart.
          const md = (await server.ssrLoadModule('/src/lib/markdown.ts')) as MarkdownModule
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(files(md)[name])
        } catch (error) {
          // Connect doesn't catch async rejections; hand it the error instead.
          next(error)
        }
      })
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files({ buildFullMarkdown, buildLlmsTxt }))) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}

/** The resume PDF at site.resumePdf, generated from src/content. */
function resumePdf(): Plugin {
  const path = site.resumePdf

  return {
    name: 'resume-pdf',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== path) return next()
        try {
          // Loaded per request so content edits show up without a restart.
          const resume = (await server.ssrLoadModule('/src/lib/resume.ts')) as ResumeModule
          const pdf = await resume.buildResumePdf()
          res.setHeader('Content-Type', 'application/pdf')
          res.end(pdf)
        } catch (error) {
          next(error)
        }
      })
    },
    async generateBundle() {
      this.emitFile({ type: 'asset', fileName: path.slice(1), source: await buildResumePdf() })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), llmsTxt(), resumePdf()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
