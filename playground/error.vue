<script setup lang="ts">
import { useSanctumAuth } from '#imports';

interface ErrorProps {
    error?: {
        url: string;
        statusCode: number;
        statusMessage: string;
        message: string;
        description: string;
        data?: any;
    };
}

const props = defineProps<ErrorProps>();

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

    <strong>Error</strong>
    <p>{{ props.error }}</p>
</template>

<style scoped>
.menu {
    display: flex;
    gap: 1rem;
}
</style>
