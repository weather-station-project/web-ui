import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 5173,
    open: false,
    proxy: {
      '^/api/.*': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        headers: {
          'Content-Type': 'application/json',
        },
        rewrite: (path: string): string => path.replace(/^\/api/, ''),
        configure: (proxy): void => {
          proxy.on('error', (err): void => {
            console.error('Proxy error: ', err)
          })
          proxy.on('proxyReq', (proxyReq, req): void => {
            if (req.url === '/auth') {
              const bodyData: string = JSON.stringify({ login: 'dashboard', password: '123456' })

              proxyReq.setHeader('content-length', bodyData.length)
              proxyReq.write(bodyData)
              proxyReq.end()
            }
            console.log(`Sending request with method ${req.method} to ${req.url}`)
          })
          proxy.on('proxyRes', (proxyRes, req): void => {
            console.log(`Received (${proxyRes.statusCode}) ${proxyRes.statusMessage} from the target ${req.url}`)
          })
        },
      },
      '^.*/otel': {
        target: 'http://localhost:4318',
        changeOrigin: true,
        secure: false,
        rewrite: (path: string): string => path.replace(/^\/otel/, ''),
        configure: (proxy): void => {
          proxy.on('error', (err): void => {
            console.error('Proxy error: ', err)
          })
          proxy.on('proxyReq', (_proxyReq, req): void => {
            console.log(`Sending request with method ${req.method} to ${req.url}`)
          })
          proxy.on('proxyRes', (proxyRes, req): void => {
            console.log(`Received (${proxyRes.statusCode}) ${proxyRes.statusMessage} from the target ${req.url}`)
          })
        },
      },
      '/socket.io': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  logLevel: 'silent',
  build: { rollupOptions: { external: ['/env.js'] } },
})
