<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({ email: '', password: '' })
const errorMessage = ref('')

async function handleLogin() {
  const user = await authStore.signIn(credentials.value)
  if (user) {
    router.push({ name: 'home' })
  } else {
    errorMessage.value = authStore.error || 'No se pudo iniciar sesión. Revisa tus credenciales.'
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-form-container">
      <div class="auth-header">
        <img src="@/assets/logo.png" alt="Logo" class="auth-logo" />
      </div>
      <h2 class="auth-title text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="credentials.email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" v-model="credentials.password" required>
        </div>
        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">{{ authStore.loading ? 'Iniciando...' : 'Iniciar Sesión' }}</button>
        </div>
      </form>
      <div class="text-center mt-4 auth-links">
        <RouterLink to="/register">¿No tienes cuenta? Regístrate</RouterLink>
        <span class="mx-2">|</span>
        <RouterLink to="/forgot-password">¿Olvidaste tu contraseña?</RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/auth.css';
</style>