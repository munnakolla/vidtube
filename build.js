import { build } from 'vite'
import { fileURLToPath, URL } from 'node:url'

try {
  await build({
    // Build configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    },
    base: './',
    plugins: [
      (await import('@vitejs/plugin-react')).default()
    ]
  })
  console.log('Build completed successfully!')
} catch (error) {
  console.error('Build failed:', error)
  process.exit(1)
}
