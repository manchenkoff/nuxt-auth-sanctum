<script lang="ts" setup>
const { header } = useAppConfig()
</script>

<template>
  <div class="flex gap-2 items-center">
    <UColorModeImage
      v-if="header?.logo?.dark || header?.logo?.light"
      :light="header?.logo?.light!"
      :dark="header?.logo?.dark!"
      :alt="header?.logo?.alt"
      class="h-8 w-auto shrink-0"
    />

    <span>{{ header.title }}</span>
  </div>
</template>

<style scoped></style>
