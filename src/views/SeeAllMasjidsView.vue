<template>
  <div class="pb-24 pt-4 px-4 safe-area-top min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
        <ArrowLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">All Masjids</h1>
    </header>

    <!-- Search Bar -->
    <div class="mb-6 relative">
      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search by Name or City..." 
        class="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 text-gray-700 dark:text-gray-200"
      />
    </div>

    <!-- Results -->
    <div v-if="loading" class="space-y-4">
        <div v-for="n in 5" :key="n" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm animate-pulse h-24"></div>
    </div>

    <div v-else-if="filteredMasjids.length > 0" class="space-y-4">
      <MasjidCard 
        v-for="masjid in filteredMasjids" 
        :key="masjid.id" 
        :masjid="masjid" 
        @click="router.push(`/masjid/${masjid.id}`)"
      />
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 text-center">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400">
        <SearchXIcon class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No masjids found</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm max-w-[200px]">Try adjusting your search criteria</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, SearchIcon, SearchXIcon } from 'lucide-vue-next'
import MasjidCard from '../components/MasjidCard.vue'
import masjidsData from '../data/masjids.json'
import { useSettingsStore } from '../stores/settings'

const router = useRouter()
const masjids = ref([])
const loading = ref(true)
const searchQuery = ref('')
const settingsStore = useSettingsStore()

// Mock location fallback if store mock is empty (though real app uses store)
const userLocation = { lat: 19.075, lng: 72.877 }

// Calculate Distance reusable function (usually in a composable)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const fetchMasjids = async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  
  masjids.value = masjidsData.map(m => {
    const dist = calculateDistance(userLocation.lat, userLocation.lng, m.lat, m.lng)
    return {
      ...m,
      distance: dist.toFixed(2),
      rawDistance: dist,
      city: m.city || 'Unknown'
    }
  })
  loading.value = false
}

const filteredMasjids = computed(() => {
  if (!searchQuery.value) return masjids.value
  
  const query = searchQuery.value.toLowerCase()
  return masjids.value.filter(m => {
    return m.name.toLowerCase().includes(query) || 
           m.city.toLowerCase().includes(query)
  })
})

onMounted(() => {
  fetchMasjids()
})
</script>

<style scoped>
.safe-area-top {
  padding-top: env(safe-area-inset-top, 20px);
}
</style>
