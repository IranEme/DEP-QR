<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    router.push({ name: 'item-detail', params: { id: updatedItem.id } })
  }
}
</script>

<template>
  <div class="view-container">
    <div class="detail-container">
      
      <div class="card-form">
        <h1 class="page-title text-center">Editar artículo</h1>
        <div v-if="loading" class="text-center mt-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2">Cargando datos del artículo...</p>
        </div>

        <div v-else-if="error || !currentItem" class="alert alert-danger">
          <p><strong>Error:</strong> No se pudo cargar el artículo.</p>
          <pre>{{ error || 'El artículo no fue encontrado.' }}</pre>
        </div>

        <InventoryForm
          v-else
          @submit="handleUpdateItem"
          :loading="loading"
          :initialData="currentItem"
          button-text="Actualizar Artículo"
        />
      </div>
    </div>
  </div>
</template>
