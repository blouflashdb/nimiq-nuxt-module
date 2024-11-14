<template>
  <div>
    Consensus: {{ nimiq.consensus }}
  </div>
  <div>
    Peer count: {{ nimiq.peerCount }}
  </div>
</template>

<script setup lang="ts">
const nimiq = useNimiq()
</script>
