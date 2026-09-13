<script setup lang="ts"></script>

<template>
  <nav>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/profile">Profile</NuxtLink>
  </nav>

  <div>
    <slot />
  </div>
</template>

<style scoped></style>
