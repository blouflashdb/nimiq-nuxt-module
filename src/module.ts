import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import wasm from 'vite-plugin-wasm'
import defu from 'defu'
import { name, version } from '../package.json'

// Module options TypeScript interface definition
export interface ModuleOptions {
  network: 'TestAlbatross' | 'DevAlbatross'
  seedNodes: string[]
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error'
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'nimiq',
    compatibility: {
      nuxt: '>=3.14.0',
    },
  },
  defaults: {
    network: 'TestAlbatross',
    seedNodes: [
      '/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed2.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed3.pos.nimiq-testnet.com/tcp/8443/wss',
      '/dns4/seed4.pos.nimiq-testnet.com/tcp/8443/wss',
    ],
    logLevel: 'info',
  },
  setup(_options, _nuxt) {
    _nuxt.options.vite.plugins = _nuxt.options.vite.plugins ?? []
    _nuxt.options.vite.plugins.push(wasm())

    _nuxt.options.vite.optimizeDeps = _nuxt.options.vite.optimizeDeps ?? {}
    _nuxt.options.vite.optimizeDeps.exclude = _nuxt.options.vite.optimizeDeps.exclude ?? []
    _nuxt.options.vite.optimizeDeps.exclude.push('@nimiq/core')

    _nuxt.options.runtimeConfig.public.nimiq = defu(_nuxt.options.runtimeConfig.public.nimiq as ModuleOptions, {
      network: _options.network,
      seedNodes: _options.seedNodes,
      logLevel: _options.logLevel,
    })

    const resolver = createResolver(import.meta.url)

    addImportsDir(resolver.resolve('runtime/composables'))
  },
})
