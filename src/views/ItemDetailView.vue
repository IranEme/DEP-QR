<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import VueQrcode from 'vue-qrcode'

const route = useRoute()
const router = useRouter()
const inventoryStore = useInventoryStore()
const authStore = useAuthStore()

const { currentItem, loading, error } = storeToRefs(inventoryStore)
const { isAdmin } = storeToRefs(authStore)
const itemId = route.params.id

const qrCodeCanvas = ref(null)

onMounted(() => {
  inventoryStore.fetchItemById(itemId)
})

async function handleDelete() {
  if (confirm('¿Estás seguro de que quieres borrar este artículo?')) {
    await inventoryStore.deleteItem(itemId)
    router.push({ name: 'home' })
  }
}

const qrValue = computed(() => {
  if (currentItem.value) {
    const paddedId = String(currentItem.value.id).padStart(4, '0')
    return `INV-${paddedId}`
  }
  return ''
})

const printLabel = () => {
  if (!currentItem.value || !qrCodeCanvas.value) return

  const qrImageElement = qrCodeCanvas.value.$el
  if (!qrImageElement || !qrImageElement.src) return

  const qrImage = new Image()
  qrImage.src = qrImageElement.src

  qrImage.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    const canvasWidth = 300
    const canvasHeight = 280 // Adjusted height to include ID
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.drawImage(qrImage, 50, 20, 200, 200)

    ctx.fillStyle = 'black'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`ID: ${qrValue.value}`, canvasWidth / 2, 260)

    const dataURL = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `etiqueta-${qrValue.value}.png`
    link.click()
  }
}
</script>

<template>
  <div class="detail-container">
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

    <div v-else>
      <div class="row">
        <div class="col-md-5 text-center mb-4 mb-md-0">
          <h4 class="mb-3">Código QR</h4>
          <div class="p-3 rounded d-inline-block">
            <VueQrcode
              ref="qrCodeCanvas"
              :value="qrValue"
              :options="{ width: 220 }"
            />
          </div>
          <small class="d-block mt-2 text-muted">ID: {{ qrValue }}</small>
          <button @click="printLabel" class="btn btn-primary mt-3">
            Imprimir Etiqueta
          </button>
        </div>

        <div class="col-md-7">
          <h2 class="card-title mb-3">{{ currentItem.nombre_articulo }}</h2>
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-0">
              <strong>Modelo:</strong> {{ currentItem.modelo || 'N/A' }}
            </li>
            <li class="list-group-item px-0">
              <strong>Nº de Serie:</strong> {{ currentItem.numero_serie || 'N/A' }}
            </li>
            <li class="list-group-item px-0">
              <strong>Nº de Importación:</strong> {{ currentItem.numero_importacion || 'N/A' }}
            </li>
            <li class="list-group-item px-0">
              <strong>Fecha de Registro:</strong>
              {{ new Date(currentItem.created_at).toLocaleString() }}
            </li>
          </ul>

          <div v-if="isAdmin" class="mt-4">
            <RouterLink :to="{ name: 'edit-item', params: { id: currentItem.id } }" class="btn btn-primary me-2">
              Editar
            </RouterLink>
            <button @click="handleDelete" class="btn btn-danger">
              Borrar
            </button>
          </div>

        </div>
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
  max-width: 700px;
  margin: 0 auto;
}

.list-group-item {
  background-color: transparent;
}
</style>