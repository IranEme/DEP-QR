import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBox, faPlus, faQrcode, faSignOutAlt, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons' // Added faSearch, faTimes

library.add(faBox, faPlus, faQrcode, faSignOutAlt, faSearch, faTimes) // Added faSearch, faTimes

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')