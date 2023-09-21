<script lang="ts" setup>
import { useSanctumAuth } from '#imports';

const { isAuthenticated, logout } = useSanctumAuth();
</script>

<template>
    <NuxtLoadingIndicator />

    <h1>Nuxt - Laravel Sanctum application sample</h1>

    <nav class="menu">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/logout">Logout</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
        <NuxtLink to="/welcome">Welcome</NuxtLink>

        <button v-if="isAuthenticated" @click="logout">Logout</button>
    </nav>

    <hr />
    <slot />
</template>

<style scoped>
.menu {
    display: flex;
    gap: 1rem;
}
</style>
