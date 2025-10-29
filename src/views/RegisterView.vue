<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()

const credentials = ref({ email: '', password: '' })
const successMessage = ref('')
const errorMessage = ref('')

async function handleRegister() {
  successMessage.value = ''
  errorMessage.value = ''
  const user = await authStore.signUp(credentials.value)
  if (authStore.error) {
    errorMessage.value = authStore.error
  } else {
    successMessage.value = '¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.'
    credentials.value = { email: '', password: '' }
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-form-container">
      <div class="auth-header">
        <img src="@/assets/logo.png" alt="Logo" class="auth-logo" />
      </div>
      <h2 class="auth-title text-center mb-4">Crear Cuenta</h2>
      <form @submit.prevent="handleRegister">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" id="email" v-model="credentials.email" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="password" v-model="credentials.password" required placeholder="Mínimo 6 caracteres">
        </div>
        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">{{ authStore.loading ? 'Registrando...' : 'Crear Cuenta' }}</button>
        </div>
      </form>
      <div class="text-center mt-4 auth-links">
        <RouterLink to="/login">¿Ya tienes cuenta? Inicia sesión</RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/auth.css';
</style>