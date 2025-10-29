<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '@/stores/inventory'
import InventoryForm from '@/components/InventoryForm.vue'

const route = useRoute()
const router = useRouter()
const inventoryStore = useInventoryStore()

const { currentItem, loading, error } = storeToRefs(inventoryStore)
const itemId = route.params.id

onMounted(() => {
  inventoryStore.fetchItemById(itemId)
})

async function handleUpdateItem(itemData) {
  const updatedItem = await inventoryStore.updateItem(itemId, itemData)
  if (updatedItem) {
    inventoryStore.setNotification('Cambios guardados correctamente.', 'success')
    router.push({ name: 'home' })
  }
}
</script>

<template>
  <div class="view-container">
    

    <div class="card-form">
      <div v-if="loading && !currentItem" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-2">Cargando datos del artículo...</p>
      </div>

      <div v-if="error" class="alert alert-danger">
        <p><strong>Ha ocurrido un error.</strong></p>
        <pre>{{ error }}</pre>
      </div>

      <InventoryForm 
        v-if="currentItem"
        :initial-data="currentItem" 
        @submit="handleUpdateItem" 
        :loading="loading" 
        button-text="Guardar Cambios"
      />
    </div>
  </div>
</template>
