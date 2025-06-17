import { defineManifest } from "../lib/vite-chrome-extension-plugin/vite-chrome-extension-plugin"

export default defineManifest({
  manifest_version: 3,
  name: "PlaceholdUrl",
  version: "1.0.0",
  description: "Fill placeholders in URLs and navigate with a single click",
  icons: {
    128: "icon.png"
  },
  permissions: [
    "tabs"
  ],
  background: {
    service_worker: "./src/background.ts",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_sidebar: "src/pages/sidebar/index.html"
  }
});