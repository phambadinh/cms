import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window', // FIX: sockjs-client cần biến `global` của Node, map nó sang `window`
  },
})