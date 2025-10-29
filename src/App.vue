<script setup>
import { computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()

const authRoutes = ['login', 'register', 'forgot-password']
const darkBgRoutes = ['login', 'register', 'forgot-password', 'home', 'item-detail', 'add', 'scan', 'edit-item']

const showNavbar = computed(() => {
  return !authRoutes.includes(route.name)
})

// Add a class to the body tag based on the route
watch(
  () => route.name,
  (routeName) => {
    if (darkBgRoutes.includes(routeName)) {
      document.body.classList.add('dark-bg')
      document.body.classList.remove('light-bg')
    } else {
      document.body.classList.add('light-bg')
      document.body.classList.remove('dark-bg')
    }
  },
  { immediate: true }
)
</script>

<template>
  <Navbar v-if="showNavbar" />
  <main class="main-content" :class="{ 'with-navbar': showNavbar }">
    <RouterView />
  </main>
</template>

<style>
/* Global styles */
body.dark-bg {
  background-color: #343a40;
}

body.light-bg {
  background-color: #f8f9fa;
}

.main-content {
  padding-bottom: 2rem;
}

.main-content.with-navbar {
  padding-top: 100px; /* Adjust for fixed navbar */
}

.view-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
