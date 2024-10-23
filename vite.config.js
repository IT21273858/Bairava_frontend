import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import { config } from 'dotenv';

config();
export default defineConfig({
  define: {
    'process.env': process.env,
    // 'process.env.VITE_REACT_APP_BASE_URL': JSON.stringify('http://localhost:8000'),
    // 'import.meta.env.VITE_REACT_APP_BASE_URL': JSON.stringify('http://localhost:8000'),
    // 'process.env.VITE_REACT_APP_BASE_URL': JSON.stringify('https://vl-backend-615957435766.asia-southeast1.run.app'),
    // 'import.meta.env.VITE_REACT_APP_BASE_URL': JSON.stringify('https://vl-backend-615957435766.asia-southeast1.run.app'),
    'import.meta.env.VITE_REACT_APP_BASE_URL': JSON.stringify('https://9vhcpx4m-8000.asse.devtunnels.ms'),
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  preview:{
    port:8080,
    strictPort:true,
    host:true,
  },
})