<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'

const router = useRouter()
const scanner = ref(null)
const scanResult = ref(null)
const scanError = ref(null)

const config = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
}

const onScanSuccess = (decodedText, decodedResult) => {
  if (scanner.value && scanner.value.isScanning) {
    scanner.value.stop()
  }
  scanResult.value = decodedText

  const match = decodedText.match(/^INV-(\d+)$/)
  if (match && match[1]) {
    const itemId = parseInt(match[1], 10)
    router.push({ name: 'item-detail', params: { id: itemId } })
  } else {
    scanError.value = `El código QR (${decodedText}) no tiene el formato esperado (ej. INV-0001).`
  }
}

const onScanFailure = (error) => {
  const errorMessage = typeof error === 'string' ? error : String(error);

  const isQrNotFound = errorMessage.includes('No QR code found') || errorMessage.includes('NotFoundException') || errorMessage.includes('No MultiFormat Readers were able to detect the code');
  const isDeprecationWarning = errorMessage.includes('MediaDevices.getUserMedia() is deprecated');

  if (!isQrNotFound && !isDeprecationWarning) {
    scanError.value = errorMessage;
  }
}

onMounted(() => {
  scanner.value = new Html5Qrcode('qr-reader')
  scanner.value.start({ facingMode: 'environment' }, config, onScanSuccess, onScanFailure)
    .catch(err => {
      scanError.value = `No se pudo iniciar el escáner: ${err}. Asegúrate de dar permiso para usar la cámara.`
    })
})

onBeforeUnmount(() => {
  if (scanner.value && scanner.value.isScanning) {
    scanner.value.stop()
      .catch(err => console.error('Error al detener el escáner:', err))
  }
})
</script>

<template>
  <div class="view-container">
    <div class="detail-container">
      <h1 class="page-title text-center">Escanear código QR</h1>
      <div class="card-form text-center">
        <div v-if="scanResult" class="alert alert-success">
          <p class="mb-1"><strong>Código detectado:</strong> {{ scanResult }}</p>
          <p class="mb-0">Redirigiendo...</p>
        </div>

        <div v-if="scanError" class="alert alert-danger">
          {{ scanError }}
        </div>
        
        <p v-if="!scanError && !scanResult">Apunta la cámara hacia un código QR.</p>

        <div id="qr-reader" style="width: 100%"></div>
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
  margin-bottom: 2rem;
}
</style>