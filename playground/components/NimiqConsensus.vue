<template>
  <div>
    Consensus: {{ nimiq.consensus }}
  </div>
</template>

<script setup lang="ts">
const nimiq = useNimiq()
</script>
