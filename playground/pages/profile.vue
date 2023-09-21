<script lang="ts" setup>
import { definePageMeta, useSanctumAuth } from '#imports';

definePageMeta({
    middleware: ['sanctum:auth'],
});

const { isAuthenticated, user } = useSanctumAuth();
</script>

<template>
    <p>Your authentication status - {{ isAuthenticated }}</p>
    <p>Identity object - {{ user }}</p>
</template>
