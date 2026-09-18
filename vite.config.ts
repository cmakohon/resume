import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import { buildFullMarkdown, buildLlmsTxt } from './src/lib/markdown.ts'

type MarkdownModule = typeof import('./src/lib/markdown.ts')

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
        // Loaded per request so content edits show up without a restart.
        const md = (await server.ssrLoadModule('/src/lib/markdown.ts')) as MarkdownModule
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(files(md)[name])
      })
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files({ buildFullMarkdown, buildLlmsTxt }))) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), llmsTxt()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
