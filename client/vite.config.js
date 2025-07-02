import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if SSL certificates exist
const sslKeyPath = path.resolve(__dirname, '../server/ssl/key.pem')
const sslCertPath = path.resolve(__dirname, '../server/ssl/cert.pem')
const sslExists = fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    ...(sslExists && {
      https: {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
      },
    }),
    proxy: {
      '/api': {
        target: sslExists ? 'https://localhost:3001' : 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})