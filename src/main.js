import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

// Leaflet Icon Fix
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons not showing up in Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png'
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png'
import shadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: shadow
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
