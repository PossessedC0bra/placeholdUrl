import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        rollupOptions: {
            input: {
                background: path.resolve(__dirname, './src/background/index.ts'),
                popup: path.resolve(__dirname, './src/popup/index.html'),
            },
            output: {
                entryFileNames: '[name]/[name].js',
            },
        }
    }
})
