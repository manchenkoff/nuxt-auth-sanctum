<script setup lang="ts">
import type { FetchError } from 'ofetch'

definePageMeta({
  sanctum: {
    guestOnly: true,
  },
})

const email = ref('')
const password = ref('')

const error = ref('')

const { login } = useSanctumAuth()

async function onLogin() {
  error.value = ''

  const credentials = {
    email: email.value,
    password: password.value,
  }

  try {
    await login(credentials)
  }
  catch (e) {
    const err = e as FetchError

    if (err.response?.status == 422) {
      error.value = err.response?._data['message']
    }
  }
}
</script>

<template>
  <form>
    <input
      id="email"
      v-model="email"
      type="email"
    >
    <input
      id="password"
      v-model="password"
      type="password"
    >
    <input
      id="submit"
      type="submit"
      value="Log in"
      @click.prevent="onLogin"
    >
  </form>
  <span id="login-error">{{ error }}</span>
</template>

<style scoped></style>
