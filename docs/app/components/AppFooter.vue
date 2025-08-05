<script setup lang="ts">
const { footer } = useAppConfig()
</script>

<template>
  <UFooter>
    <template #left>
      {{ footer.credits }} | <NuxtLink
        to="https://github.com/manchenkoff/nuxt-auth-sanctum/blob/main/LICENSE"
        target="_blank"
        class="text-gray-900 dark:text-white"
      >MIT License</NuxtLink>
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />

      <template v-if="footer?.links">
        <UButton
          v-for="(link, index) of footer?.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
