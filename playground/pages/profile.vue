<script lang="ts" setup>
import { definePageMeta, useSanctumAuth } from '#imports';

definePageMeta({
    middleware: ['sanctum:auth'],
});

const { isAuthenticated, user, refreshIdentity } = useSanctumAuth();
</script>

<template>
    <p>Your authentication status - {{ isAuthenticated }}</p>
    <p>Identity object - {{ user }}</p>
    <div><button @click="refreshIdentity">Refetch user</button></div>
</template>
