<script lang="ts" setup>
import {
    definePageMeta,
    reactive,
    ref,
    useRoute,
    useSanctumAuth,
} from '#imports';

definePageMeta({
    middleware: ['sanctum:guest'],
});

const { login } = useSanctumAuth();
const route = useRoute();

const credentials = reactive({
    email: '',
    password: '',
    remember: false,
});

const loginError = ref('');

async function onFormSubmit() {
    try {
        await login(credentials);
    } catch (error) {
        loginError.value = error as string;
    }
}
</script>

<template>
    <div v-if="route.query.redirect">
        Hmmm, looks like you tried to open
        <em>"{{ route.query.redirect }}"</em> page, login first to access it and
        we can redirect you there
    </div>

    <h2>Login form</h2>

    <p v-if="loginError" class="error-message">Error - {{ loginError }}</p>

    <form class="login-form" @submit.prevent="onFormSubmit">
        <div class="input-group">
            <label for="email">User email</label>
            <input
                id="email"
                v-model="credentials.email"
                type="text"
                name="email"
            />
        </div>

        <div class="input-group">
            <label for="password">Password</label>
            <input
                id="password"
                v-model="credentials.password"
                type="password"
                autocomplete="current-password"
                name="password"
            />
        </div>

        <div class="input-group">
            <label for="remember">Remember me</label>
            <input
                id="remember"
                v-model="credentials.remember"
                type="checkbox"
                name="remember"
            />
        </div>

        <button type="submit">Log in</button>
    </form>
</template>

<style scoped>
.login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: fit-content;
}

.input-group {
    display: flex;
    gap: 0.5rem;
}

.error-message {
    color: red;
}
</style>
