<template>
  <div class="p-4 safe-area-top pb-24 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-screen">
    <header class="mb-4 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Assalamu Alaikum</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
          <MapPinIcon class="w-3 h-3 text-emerald-500" /> {{ userAddress }}
        </p>
      </div>
      
      <div class="flex items-center gap-2">
        <!-- Add Masjid Button (Small "+" Icon) -->
        <button 
           @click="router.push('/add-masjid')"
           class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-emerald-600 transition-colors"
           title="Add Missing Masjid"
        >
           <PlusIcon class="w-5 h-5" />
        </button>

        <div v-if="settingsStore.isLoggedIn" class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
          {{ getInitials(settingsStore.user.name) }}
        </div>
        <button v-else @click="showLogin = true" class="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
          Login
        </button>
      </div>
    </header>

    <!-- Map Section -->
    <div class="relative w-full h-56 rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-100 dark:border-gray-800 z-0 bg-gray-100 dark:bg-gray-800">
      <l-map 
        v-if="!loading && userLocation[0]"
        ref="map" 
        v-model:zoom="zoom" 
        :center="center"
        :use-global-leaflet="false"
      >
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>

        <!-- User Marker -->
        <l-marker :lat-lng="userLocation">
           <l-icon
              :icon-size="[20, 20]"
              :icon-anchor="[10, 10]"
              class-name="user-marker-icon"
           >
             <div class="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse ring-4 ring-blue-500/30"></div>
           </l-icon>
        </l-marker>

        <!-- Masjid Markers -->
        <l-marker 
          v-for="masjid in filteredMasjids" 
          :key="masjid.id"
          :lat-lng="[masjid.lat, masjid.lng]"
          @click="router.push(`/masjid/${masjid.id}`)"
        >
        </l-marker>
      </l-map>
      <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-2">
         <Loader2Icon class="w-6 h-6 animate-spin" />
         <span class="text-xs">Locating you...</span>
      </div>
        
      <!-- Float Button to Recenter -->
      <button 
        @click="getUserLocation"
        class="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-[1000] text-gray-600 dark:text-gray-200 hover:text-emerald-600"
      >
        <CrosshairIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Distance Filter -->
    <section class="mb-6">
       <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button 
             v-for="dist in distances" 
             :key="dist.value"
             @click="selectedDistance = dist.value"
             :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedDistance === dist.value 
                   ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30 ring-1 ring-emerald-600' 
                   : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
             ]"
          >
             {{ dist.label }}
          </button>
       </div>
    </section>

    <!-- Nearby Masjids -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-100">Nearby Masjids</h2>
        <button @click="router.push('/masjids')" class="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline">See all</button>
      </div>

      <div class="space-y-4">
        <div v-if="loadingMasjids" class="space-y-4">
           <div v-for="n in 3" :key="n" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-pulse h-32"></div>
        </div>
        
        <div v-else-if="filteredMasjids.length > 0">
           <MasjidCard 
             v-for="masjid in filteredMasjids" 
             :key="masjid.id" 
             :masjid="masjid" 
             @click="router.push(`/masjid/${masjid.id}`)"
           />
        </div>

        <div v-else class="text-center py-8 text-gray-400 dark:text-gray-500">
           <p>No masjids found within {{ selectedDistance }}km.</p>
           <button @click="selectedDistance = 5.0" class="text-emerald-500 text-sm mt-2">Expand search radius</button>
        </div>
      </div>
    </section>
    
    <LoginModal :isOpen="showLogin" @close="showLogin = false" @login-success="showLogin = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MapPinIcon, CrosshairIcon, Loader2Icon, PlusIcon } from 'lucide-vue-next'
import MasjidCard from '../components/MasjidCard.vue'
import masjidsData from '../data/masjids.json'
import LoginModal from '../components/LoginModal.vue'
import { useSettingsStore } from '../stores/settings'
import 'leaflet/dist/leaflet.css'
import { LMap, LTileLayer, LMarker, LIcon } from '@vue-leaflet/vue-leaflet'

const router = useRouter()
const settingsStore = useSettingsStore()

const masjids = ref([])
const loading = ref(true)
const loadingMasjids = ref(false)
const showLogin = ref(false)
const userAddress = ref("Locating...")

// Map Settings
const zoom = ref(15)
const userLocation = ref([0, 0]) 
const center = ref([19.076, 72.8777]) // Default fallback (Mumbai)

// Distance Filter
const selectedDistance = ref(1.0)
const distances = [
   { label: '0.5 km', value: 0.5 },
   { label: '1.0 km', value: 1.0 },
   { label: '2.0 km', value: 2.0 },
]

// Haversine Algo
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Helper to get formatted address
const getAddress = async (lat, lon) => {
    try {
        // Nominatim requires a User-Agent header
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`, {
            headers: {
                'User-Agent': 'ApniMasjid/1.0 (web.wise0123@gmail.com)' 
            }
        })
        
        if (!response.ok) {
             console.warn("Nominatim rate limit or error", response.status)
             return "Unknown Location"
        }

        const data = await response.json()
        if (data.address) {
            // Extract meaningful parts, e.g., Area, City
            const parts = []
            if (data.address.suburb) parts.push(data.address.suburb)
            else if (data.address.neighbourhood) parts.push(data.address.neighbourhood)
            else if (data.address.residential) parts.push(data.address.residential)
            
            if (data.address.city) parts.push(data.address.city)
            else if (data.address.town) parts.push(data.address.town)
            else if (data.address.village) parts.push(data.address.village)
            
            return parts.length > 0 ? parts.join(', ') : "Unknown Location"
        }
        return "Unknown Location"
    } catch (error) {
        console.error("Error fetching address:", error)
        return "Unknown Location"
    }
}

const getUserLocation = () => {
    loading.value = true
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                userLocation.value = [latitude, longitude]
                center.value = [latitude, longitude]
                
                // Fetch Address
                userAddress.value = "Fetching address..."
                const address = await getAddress(latitude, longitude)
                userAddress.value = address

                loading.value = false
                fetchMasjids()
            },
            (error) => {
                console.error("Error getting location: ", error)
                // Fallback to Mumbai
                userLocation.value = [19.076, 72.8777]
                center.value = [19.076, 72.8777]
                userAddress.value = "Mumbai (Default)"
                loading.value = false
                fetchMasjids()
            }
        )
    } else {
        loading.value = false
        alert("Geolocation is not supported by this browser.")
    }
}

// Replace masjidsData import with Supabase call
import { supabase } from '../supabase'
// Keep local data as failsafe or initial load if needed
// import masjidsData from '../data/masjids.json' 

const fetchMasjids = async () => {
  loadingMasjids.value = true
  
  try {
      // Fetch from Supabase
      const { data, error } = await supabase.from('masjids').select('*')
      
      if (error) {
         console.error("Error fetching masjids:", error)
         // Fallback to empty or local data if you wish
         // masjids.value = masjidsData ...
      } else {
         // Transform data
         masjids.value = data.map(m => {
            const dist = calculateDistance(
                userLocation.value[0], 
                userLocation.value[1], 
                m.lat, 
                m.lng
            )
            return {
                ...m,
                distance: dist.toFixed(2), 
                rawDistance: dist,
                // Ensure times object exists if missing in DB
                times: m.times || {
                    "Fajr": "05:30 AM",
                    "Dhuhr": "01:30 PM", 
                    "Asr": "05:15 PM",
                    "Maghrib": "06:45 PM",
                    "Isha": "08:30 PM"
                }
            }
         })
      }
  } catch (err) {
      console.error("Unexpected error fetching masjids:", err)
  }
  
  loadingMasjids.value = false
}

const filteredMasjids = computed(() => {
   return masjids.value
      .filter(m => m.rawDistance <= selectedDistance.value)
      .sort((a, b) => a.rawDistance - b.rawDistance)
})

watch(selectedDistance, () => {
    // Re-trigger helps if we were fetching fresh data, but here computing is enough
})

onMounted(() => {
  getUserLocation()
})
</script>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top, 20px);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
