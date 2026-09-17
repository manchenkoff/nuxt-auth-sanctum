<script setup lang="ts">
const { data } = await useSanctumFetch('/api/ping', { key: 'ping-data' })
</script>

<template>
  <div>
    <p id="ping-value">
      {{ data?.timestamp }}
    </p>
  </div>
</template>
