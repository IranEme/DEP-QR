<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  buttonText: {
    type: String,
    default: 'Guardar Artículo'
  }
})

const emit = defineEmits(['submit'])

const item = ref({ ...props.initialData })

watch(() => props.initialData, (newData) => {
  if (newData) {
    item.value = { ...newData }
  }
}, { immediate: true, deep: true })

function handleSubmit() {
  emit('submit', { ...item.value })
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="nombre_articulo" class="form-label">Nombre del Artículo</label>
      <input
        type="text"
        class="form-control"
        id="nombre_articulo"
        v-model="item.nombre_articulo"
        required
      />
    </div>
    <div class="mb-3">
      <label for="modelo" class="form-label">Modelo</label>
      <input
        type="text"
        class="form-control"
        id="modelo"
        v-model="item.modelo"
      />
    </div>
    <div class="mb-3">
      <label for="numero_serie" class="form-label">Número de Serie</label>
      <input
        type="text"
        class="form-control"
        id="numero_serie"
        v-model="item.numero_serie"
      />
    </div>
    <div class="mb-3">
      <label for="numero_importacion" class="form-label">Número de Importación</label>
      <input
        type="text"
        class="form-control"
        id="numero_importacion"
        v-model="item.numero_importacion"
      />
    </div>
    <div class="d-grid mt-4">
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        {{ loading ? 'Guardando...' : buttonText }}
      </button>
    </div>
  </form>
</template>
