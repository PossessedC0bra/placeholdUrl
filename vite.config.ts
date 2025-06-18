import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import chromeExtension from "@placehold-url/vite-chrome-extension-plugin";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        chromeExtension(),
    ],
    resolve: {
        preserveSymlinks: true,
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
    //     rollupOptions: {
    //         input: {
    //             manifest: path.resolve(__dirname, './src/manifest.ts'),
    //             background: path.resolve(__dirname, './src/background/index.ts'),
    //             popup: path.resolve(__dirname, './src/popup/index.html'),
    //         },
    //         output: {
    //             entryFileNames: '[name]/[name].js',
    //         },
    //     }
    }
})
