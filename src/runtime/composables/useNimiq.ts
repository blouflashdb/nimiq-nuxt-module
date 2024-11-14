import { readonly, ref } from 'vue'
import * as Nimiq from '@nimiq/core'
import { useRuntimeConfig } from '#imports'
import type { ModuleOptions } from '~/src/module'

let clientPromise: Promise<Nimiq.Client>

export function useNimiq() {
  const options = useRuntimeConfig().public.nimiq as ModuleOptions

  const consensusRef = ref('connecting')
  const peerCountRef = ref(0)

  function initializeClient() {
    clientPromise = clientPromise || (() => {
      const config = new Nimiq.ClientConfiguration()

      config.network(options.network)
      config.seedNodes(options.seedNodes)
      config.logLevel(options.logLevel)
      return Nimiq.Client.create(config.build())
    })()
  }

  function initializeConsensusListener() {
    clientPromise.then((client) => {
      client.addConsensusChangedListener((consensus) => {
        consensusRef.value = consensus
      })
    })
  }

  function initializePeerCountListener() {
    clientPromise.then((client) => {
      client.addPeerChangedListener((_peerId, _reason, peerCount, _peerInfo) => {
        peerCountRef.value = peerCount
      })
    })
  }

  initializeClient()
  initializeConsensusListener()
  initializePeerCountListener()

  return {
    clientPromise,
    consensus: readonly(consensusRef),
    peerCount: readonly(peerCountRef),
  }
}
