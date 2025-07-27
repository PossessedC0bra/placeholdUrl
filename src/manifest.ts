import {defineManifest} from "@crxjs/vite-plugin";
import {description, version} from "../package.json";

const [major, minor, patch] = version.split(".").map(Number);

export default defineManifest((env) => ({
    manifest_version: 3,

    name: env.mode === 'production' ? 'PlaceholdURL' : `PlaceholdURL (${env.mode})`,
    version: `${major}.${minor}.${patch}`,
    version_name: env.mode === 'production' ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch}-${env.mode}`,

    description: description,
    icons: {
        128: "icon.png",
    },

    permissions: [
        "tabs",
        "storage",
    ],

    background: {
        service_worker: "src/background.ts",
        type: "module"
    },
    action: {
        default_popup: "src/pages/popup/index.html",
    },
}));
