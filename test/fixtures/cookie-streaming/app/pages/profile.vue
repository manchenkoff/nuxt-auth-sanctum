<script setup lang="ts">
definePageMeta({
  middleware: ['sanctum:auth'],
})

const { logout } = useSanctumAuth()

async function onLogout() {
  await logout()
}
</script>

<template>
  <div>
    <button
      id="logout"
      @click="onLogout"
    >
      Log out
    </button>
  </div>
</template>

<style scoped></style>
