import { ref } from 'vue'
import * as Nimiq from '@nimiq/core'
import { useRuntimeConfig } from '#imports'
import type { ModuleOptions } from '~/src/module'

export function useNimiq() {
  const options = useRuntimeConfig().public.nimiq as ModuleOptions

  const client = ref<Nimiq.Client>()
  const consensus = ref('connecting')

  async function initializeClient() {
    const config = new Nimiq.ClientConfiguration()

    config.network(options.network)
    config.seedNodes(options.seedNodes)
    config.logLevel(options.logLevel)

    client.value = await Nimiq.Client.create(config.build())

    client.value.addConsensusChangedListener((state) => {
      consensus.value = state
    })
  }

  initializeClient()

  return {
    consensus,
  }
}
