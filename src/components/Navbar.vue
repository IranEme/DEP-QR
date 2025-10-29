<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img src="@/assets/logo2.png" alt="Logo" class="navbar-logo">
      </router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/">
              <font-awesome-icon icon="fa-solid fa-box" class="me-1" /> Inventario
            </router-link>
          </li>
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/add">
              <font-awesome-icon icon="fa-solid fa-plus" class="me-1" /> Añadir
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/scan">
              <font-awesome-icon icon="fa-solid fa-qrcode" class="me-1" /> Escanear QR
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <button @click="handleLogout" class="btn btn-outline-light">
              <font-awesome-icon icon="fa-solid fa-sign-out-alt" class="me-1" /> Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)

async function handleLogout() {
  await authStore.signOut()
  router.push({ name: 'login' })
}
</script>

<style scoped>
.navbar {
  /* Glassmorphism effect */
  background-color: rgba(33, 37, 41, 0.75);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* For Safari */
  box-shadow: 0 2px 4px rgba(0,0,0,.1);
}

.navbar-logo {
  height: 50px;
  width: auto;
}

.nav-link {
  font-weight: 500;
}

.router-link-exact-active {
  color: #fff !important;
  font-weight: bold;
}
</style>