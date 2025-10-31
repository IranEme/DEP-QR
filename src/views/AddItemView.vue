<script setup>
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/stores/inventory'
import { useAuthStore } from '@/stores/auth'
import InventoryForm from '@/components/InventoryForm.vue'

const router = useRouter()
const inventoryStore = useInventoryStore()
const authStore = useAuthStore()

const { loading, error, notification } = storeToRefs(inventoryStore)
const { user } = storeToRefs(authStore)

async function handleAddItem(itemData) {
  if (!user.value) {
    inventoryStore.setNotification('No se pudo obtener la información del usuario. Por favor, intenta de nuevo.', 'error');
    return
  }

  const itemWithUser = {
    ...itemData,
    user_id: user.value.id,
  }

  const newItem = await inventoryStore.addItem(itemWithUser)
  if (newItem) {
    router.push({ name: 'item-detail', params: { id: newItem.id } })
  }
}
</script>

<template>
  <div class="view-container">
    <div class="detail-container">
      <h1 class="page-title text-center">Añadir artículo</h1>
      <div class="card-form">
        <div v-if="notification" :class="`alert alert-${notification.type}`">
          {{ notification.message }}
        </div>
        <div v-if="error" class="alert alert-danger">
          <p><strong>Ha ocurrido un error al guardar el artículo.</strong></p>
          <pre>{{ error }}</pre>
        </div>
        <InventoryForm @submit="handleAddItem" :loading="loading" button-text="Añadir Artículo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 0 auto;
}

.card-form {
  padding: 0;
}

.page-title {
  margin-bottom: 2rem !important;
}

.alert {
  margin-bottom: 1rem;
}
</style>