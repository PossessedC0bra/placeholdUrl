import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import {crx} from "@crxjs/vite-plugin";
import manifest from "./src/manifest.ts";
import zip from "vite-plugin-zip-pack";
import {name, version} from "./package.json";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        crx({manifest}),
        zip({
            outDir: "dist",
            outFileName: `${name}-${version}.zip`,
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    // FIXME: remove this when @crxjs/chrome-extension-tools v2.0.3 is released
    server: {
        cors: {
            origin: [
                // ⚠️ SECURITY RISK: Allows any chrome-extension to access the vite server ⚠️
                // See https://github.com/crxjs/chrome-extension-tools/issues/971 for more info
                /chrome-extension:\/\//,
            ],
        },
    },
    legacy: {
        // ⚠️ SECURITY RISK: Allows WebSockets to connect to the vite server without a token check ⚠️
        // See https://github.com/crxjs/chrome-extension-tools/issues/971 for more info
        skipWebSocketTokenCheck: true,
    },
})
