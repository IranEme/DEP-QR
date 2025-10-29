<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/stores/inventory'
import { useAuthStore } from '@/stores/auth'

const inventoryStore = useInventoryStore()
const { items, loading, error, notification } = storeToRefs(inventoryStore)

const authStore = useAuthStore()
const { isAdmin } = storeToRefs(authStore)

onMounted(() => {
  inventoryStore.fetchItems()
})

async function handleDelete(item) {
  if (window.confirm(`¿Estás seguro de que quieres eliminar "${item.nombre_articulo}"?`)) {
    const success = await inventoryStore.deleteItem(item.id)
    if (success) {
      inventoryStore.setNotification('Artículo eliminado correctamente.', 'success')
    } else {
      inventoryStore.setNotification('Error al eliminar el artículo.', 'error')
    }
  }
}
</script>

<template>
  <div class="page-container">
    <div v-if="notification" :class="['alert', `alert-${notification.type}`]" role="alert">
      {{ notification.message }}
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Inventario principal</h1>
      <RouterLink v-if="isAdmin" to="/add" class="btn btn-primary"><font-awesome-icon icon="fa-solid fa-plus" class="me-1" /> Añadir</RouterLink>
    </div>

    <div v-if="loading && items.length === 0" class="text-center mt-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando datos desde Supabase...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <p><strong>Ha ocurrido un error al cargar los datos.</strong></p>
      <p class="mb-1"><strong>Causa probable:</strong> Asegúrate de que tus credenciales en <code>src/lib/supabaseClient.js</code> son correctas y de que la tabla <code>inventario</code> fue creada en Supabase.</p>
      <hr>
      <pre class="mb-0" style="white-space: pre-wrap; word-break: break-all;">{{ error }}</pre>
    </div>

    <div v-else-if="items.length === 0" class="alert alert-secondary text-center">
      <p class="h4">No hay artículos en el inventario.</p>
      <p>¡Haz clic en "Añadir Artículo" para crear el primero!</p>
    </div>

    <div v-else class="table-responsive-lg">
      <table class="table table-striped table-hover align-middle table-bordered shadow-sm">
        <thead class="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Modelo</th>
            <th>Nº de Serie</th>
            <th>Nº de Importación</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.nombre_articulo }}</td>
            <td>{{ item.modelo }}</td>
            <td>{{ item.numero_serie }}</td>
            <td>{{ item.numero_importacion }}</td>
            <td class="text-center">
              <div class="btn-group" role="group">
                <RouterLink :to="`/item/${item.id}`" class="btn btn-sm btn-outline-secondary">Ver QR</RouterLink>
                <template v-if="isAdmin">
                  <RouterLink :to="`/edit/${item.id}`" class="btn btn-sm btn-primary">Editar</RouterLink>
                  <button @click="handleDelete(item)" class="btn btn-sm btn-danger" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Eliminar
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/auth.css';
</style>
