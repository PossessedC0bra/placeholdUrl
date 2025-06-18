import { loadConfigFromFile, type ConfigEnv, type Plugin, type ResolvedConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'
import type { ManifestV3 } from './ManifestV3';

export function chromeExtensionPlugin(): Plugin {
  let manifest: ManifestV3;
  let config: ResolvedConfig

  return {
    name: 'vite:chrome-extension-manifest',

    async config(config, env) {
      const root = config.root ?? './';
      
      const resolvedManifestPath = path.resolve(root, 'src/manifest.ts')
      manifest = await loadManifest(env, resolvedManifestPath);

      const inputs = [];
      
      // Background script
      if (manifest.background?.service_worker) {
        inputs.push(path.resolve(root, manifest.background.service_worker))
      }
      if (manifest.action?.default_popup) {
        inputs.push(manifest.action.default_popup);
      }

      return {
        build: {
          rollupOptions: {
            input: inputs,
          },
        },
      }
    },

    configResolved(resolved) {
      config = resolved;
    },

    async generateBundle(_options, bundle, isWrite) {
      if (!isWrite) return;

      // Clone the original manifest so we can mutate it
      const updatedManifest = structuredClone(manifest)

      // Helper to find output chunk for a given source file
      const findOutputFile = (original: string): string | undefined => {
        const normalized = path.posix.normalize(original.replace(/\\/g, '/'))
        for (const [_, chunk] of Object.entries(bundle)) {
          if (chunk.type === 'chunk' && chunk.facadeModuleId) {
            const relativePath = path.relative(config.root, chunk.facadeModuleId).replace(/\\/g, '/')
            if (relativePath.endsWith(normalized)) {
              return chunk.fileName
            }
          }
        }
        return undefined
      }

      // Update background.service_worker
      if (updatedManifest.background?.service_worker) {
        const original = updatedManifest.background.service_worker
        const rewritten = findOutputFile(original)
        if (rewritten) {
          updatedManifest.background.service_worker = rewritten
        } else {
          this.warn(`Could not find output file for: ${original}`)
        }
      }

      this.emitFile({
        type: 'asset',
        fileName: 'manifest.json',
        source: JSON.stringify(updatedManifest, null, 2),
      })
    },

    async closeBundle() {
      await zipDir(config.build.outDir, path.resolve(config.root, `dist/${this.environment.config.env.VITE_APP_NAME}-${this.environment.config.env.VITE_APP_VERSION}.zip` || 'extension.zip'));
    },
  }
}

async function loadManifest(configEnv: ConfigEnv, manifestPath: string): Promise<ManifestV3> {
  // use vite config file loader as it handles js and ts and so on
  const config =  await loadConfigFromFile(configEnv, manifestPath);
  // cast to our own type (this is hackey...)
  return config?.config as ManifestV3;
}

// Helper to zip the output directory
async function zipDir(sourceDir: string, outZip: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZip)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => {
      console.log(`✓ Created ${path.basename(outZip)} (${archive.pointer()} bytes)`)
      resolve()
    })
    archive.on('error', err => reject(err))

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}

type ManifestV3FnObject = (env: ConfigEnv) => ManifestV3;
type ManifestV3FnPromise = (env: ConfigEnv) => Promise<ManifestV3>;
type ManifestV3Fn = (env: ConfigEnv) => ManifestV3 | Promise<ManifestV3>;
type ManifestV3Export = ManifestV3 | Promise<ManifestV3> | ManifestV3FnObject | ManifestV3FnPromise | ManifestV3Fn;

declare function defineManifest(config: ManifestV3): ManifestV3;
declare function defineManifest(config: Promise<ManifestV3>): Promise<ManifestV3>;
declare function defineManifest(config: ManifestV3FnObject): ManifestV3FnObject;
declare function defineManifest(config: ManifestV3FnPromise): ManifestV3FnPromise;
declare function defineManifest(config: ManifestV3Fn): ManifestV3Fn;
declare function defineManifest(config: ManifestV3Export): ManifestV3Export;

export {
  defineManifest
}