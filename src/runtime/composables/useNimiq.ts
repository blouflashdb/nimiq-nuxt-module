import { readonly, ref } from 'vue'
import { ClientConfiguration, Client, type ConsensusState } from '@nimiq/core'
import { useRuntimeConfig } from '#imports'
import type { ModuleOptions } from '~/src/module'

let clientPromise: Promise<Client>

export function useNimiq() {
  const options = useRuntimeConfig().public.nimiq as ModuleOptions

  const consensusRef = ref<ConsensusState>('connecting')
  const peerCountRef = ref(0)
  const headBlockHeightRef = ref(0)

  function initializeClient() {
    clientPromise = clientPromise || (() => {
      const config = new ClientConfiguration()

      if (options.network)
        config.network(options.network)
      if (options.seedNodes)
        config.seedNodes(options.seedNodes)
      if (options.logLevel)
        config.logLevel(options.logLevel)

      return Client.create(config.build())
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

  function initializeHeadCountListener() {
    clientPromise.then((client) => {
      client.addHeadChangedListener(async (hash) => {
        headBlockHeightRef.value = (await client.getBlock(hash)).height
      })
    })
  }

  initializeClient()
  initializeConsensusListener()
  initializePeerCountListener()
  initializeHeadCountListener()

  return {
    clientPromise,
    consensus: readonly(consensusRef),
    peerCount: readonly(peerCountRef),
    headBlockHeight: readonly(headBlockHeightRef),
  }
}
