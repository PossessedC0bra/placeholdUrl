import { defineManifest } from "@placehold-url/vite-chrome-extension-plugin";
import type { ChromeWebStoreManifestV3 } from "@placehold-url/vite-chrome-extension-plugin/ManifestV3";

export default defineManifest({
  manifest_version: 3,
  name: "PlaceholdUrl",
  version: "1.0.0",

  description: "Fill placeholders in URLs and navigate with a single click",
  icons: {
    "128": "icon.png"
  },

  permissions: [
    "tabs",
    "storage",
  ],
  optional_permissions: [
    "unlimitedStorage",
  ],

  background: {
    service_worker: "./src/background.ts",
    type: "module"
  },
  action: {
    default_popup: "src/pages/popup/index.html",
  },
  options_page: "src/pages/options/index.html",
  content_scripts: [
    {
      matches: ["*"],
      js: [
        "./src/background.ts",
      ],
    },
    {
      matches: ["*"],
      css: [
        "./src/pages/index.css"
      ]
    }
  ]
} satisfies ChromeWebStoreManifestV3);