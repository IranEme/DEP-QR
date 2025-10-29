<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const email = ref('')
const successMessage = ref('')

async function handleRecovery() {
  successMessage.value = ''
  await authStore.recoverPassword(email.value)
  if (!authStore.error) {
    successMessage.value = 'Si existe una cuenta con ese correo, se ha enviado un enlace de recuperación.'
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-form-container">
      <div class="auth-header">
        <img src="@/assets/logo.png" alt="Logo" class="auth-logo" />
      </div>
      <h2 class="auth-title text-center mb-4">Recuperar Contraseña</h2>
      <form @submit.prevent="handleRecovery">
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="authStore.error" class="alert alert-danger">
          {{ authStore.error }}
        </div>
        <div class="mb-3">
          <label for="email" class="form-label">Email de tu cuenta</label>
          <input type="email" class="form-control" id="email" v-model="email" required>
        </div>
        <div class="d-grid mt-4">
          <button type="submit" class="btn btn-primary" :disabled="authStore.loading">{{ authStore.loading ? 'Enviando...' : 'Enviar Enlace' }}</button>
        </div>
      </form>
      <div class="text-center mt-4 auth-links">
        <RouterLink to="/login">Volver a Iniciar Sesión</RouterLink>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/auth.css';
</style>