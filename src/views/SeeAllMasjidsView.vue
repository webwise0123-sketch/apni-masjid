<template>
  <div class="pb-24 pt-4 px-4 safe-area-top min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="flex items-center gap-3 mb-4">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
        <ArrowLeftIcon class="w-6 h-6" />
      </button>
      <div>
        <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">All Masjids</h1>
        <p class="text-xs text-gray-400 dark:text-gray-500" v-if="!loading">
          {{ totalCount }} masjids found
        </p>
      </div>
    </header>

    <!-- Search Bar -->
    <div class="mb-4 relative">
      <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="Search masjid name or city (e.g. Delhi, Mumbai)..." 
        class="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 text-gray-700 dark:text-gray-200"
        @keyup.enter="searchMasjids"
      />
      <button 
        v-if="searchQuery" 
        @click="clearSearch" 
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <XIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Search Button -->
    <button 
      v-if="searchQuery && searchQuery.length >= 2"
      @click="searchMasjids"
      class="w-full mb-4 bg-emerald-600 text-white py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
    >
      <SearchIcon class="w-4 h-4" />
      Search "{{ searchQuery }}"
    </button>

    <!-- Source Filter Tabs -->
    <div class="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
      <button 
        @click="sourceFilter = 'all'" 
        :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap', sourceFilter === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700']"
      >All ({{ totalCount }})</button>
      <button 
        @click="sourceFilter = 'nearby'" 
        :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap', sourceFilter === 'nearby' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700']"
      >📍 From Map ({{ nearbyCount }})</button>
      <button 
        @click="sourceFilter = 'community'" 
        :class="['px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap', sourceFilter === 'community' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700']"
      >🕌 Community ({{ communityCount }})</button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center py-16 gap-4">
      <div class="relative">
        <div class="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div class="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <div class="text-center">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-300">{{ loadingMessage }}</p>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">This may take a few seconds...</p>
      </div>
    </div>

    <!-- Results -->
    <div v-else-if="displayedMasjids.length > 0" class="space-y-3">
      <div 
        v-for="masjid in displayedMasjids" 
        :key="masjid.id"
        @click="handleMasjidClick(masjid)"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-50 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md"
      >
        <div class="flex justify-between items-start mb-2">
          <div class="flex gap-3 flex-1 min-w-0">
             <div class="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
                🕌
             </div>
             <div class="min-w-0 flex-1">
                <h3 class="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1 text-sm truncate">
                  {{ masjid.name }}
                  <BadgeCheckIcon v-if="masjid.verified" class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                   <MapPinIcon class="w-3 h-3 flex-shrink-0" /> 
                   <span class="truncate">{{ masjid.distance }} km{{ masjid.city ? ' · ' + masjid.city : '' }}</span>
                </p>
             </div>
          </div>
          <div :class="['text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2', masjid.isFromAPI ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300']">
             {{ masjid.isFromAPI ? 'OSM' : 'Added' }}
          </div>
        </div>
        
        <!-- Actual Jamat Timings -->
        <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p class="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Actual Jamat Timings</p>
          <div v-if="masjid.times && hasTimings(masjid.times)" class="grid grid-cols-5 gap-1 text-center">
            <div v-for="(time, name) in masjid.times" :key="name" class="flex flex-col items-center">
              <span class="text-[9px] font-medium uppercase text-gray-400 dark:text-gray-500">{{ name.slice(0, 3) }}</span>
              <span class="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{{ formatTime(time) }}</span>
            </div>
          </div>
          <p v-else class="text-[11px] text-gray-300 dark:text-gray-600 italic">Not added yet — tap to view details</p>
        </div>
      </div>

      <!-- Load More / Infinite Scroll Trigger -->
      <div v-if="displayedMasjids.length < filteredMasjids.length" class="flex justify-center py-4">
        <button 
          @click="loadMore" 
          class="px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <ChevronDownIcon class="w-4 h-4" />
          Load more ({{ filteredMasjids.length - displayedMasjids.length }} remaining)
        </button>
      </div>

      <p v-else class="text-center text-xs text-gray-400 dark:text-gray-600 py-4">
        — Showing all {{ displayedMasjids.length }} masjids —
      </p>
    </div>

    <!-- Empty State for search -->
    <div v-else-if="hasSearched" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">
        🔍
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No masjids found</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm max-w-[250px]">Try searching for a different city or area name</p>
      <button @click="clearSearch" class="mt-4 text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline">Clear search</button>
    </div>

    <!-- Initial Empty -->
    <div v-else class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-3xl">
        🕌
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Loading masjids...</h3>
      <p class="text-gray-500 dark:text-gray-400 text-sm">Please wait while we fetch nearby masjids</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, SearchIcon, SearchXIcon, XIcon, BadgeCheckIcon, MapPinIcon, ChevronDownIcon } from 'lucide-vue-next'
import masjidsData from '../data/masjids.json'
import { useSettingsStore } from '../stores/settings'

const router = useRouter()
const allMasjids = ref([])
const loading = ref(true)
const loadingMessage = ref('Finding nearby masjids...')
const searchQuery = ref('')
const sourceFilter = ref('all')
const hasSearched = ref(false)
const displayCount = ref(20) // Show 20 initially
const settingsStore = useSettingsStore()

const userLocation = ref({ lat: 19.075, lng: 72.877 })

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const hasTimings = (times) => {
  if (!times) return false
  return Object.values(times).some(v => v && typeof v === 'string' && v.trim() !== '')
}

const formatTime = (timeStr) => {
  if (!timeStr) return '--'
  return timeStr.replace(' AM', '').replace(' PM', '')
}

// ========== OVERPASS API ==========
const fetchFromOverpass = async (lat, lon, radiusMeters = 15000) => {
  try {
    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="place_of_worship"]["religion"~"muslim",i](around:${radiusMeters},${lat},${lon});
        way["amenity"="place_of_worship"]["religion"~"muslim",i](around:${radiusMeters},${lat},${lon});
        relation["amenity"="place_of_worship"]["religion"~"muslim",i](around:${radiusMeters},${lat},${lon});
        node["building"="mosque"](around:${radiusMeters},${lat},${lon});
        way["building"="mosque"](around:${radiusMeters},${lat},${lon});
        relation["building"="mosque"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query)
    })
    
    if (!response.ok) return []
    const data = await response.json()
    
    return data.elements
      .map(el => {
        const elLat = el.lat || (el.center && el.center.lat) || 0
        const elLng = el.lon || (el.center && el.center.lon) || 0
        if (!elLat || !elLng) return null
        const name = (el.tags && (el.tags.name || el.tags['name:en'] || el.tags['name:hi'] || el.tags['name:ur'])) || 'Masjid'
        const city = (el.tags && (el.tags['addr:city'] || el.tags['addr:suburb'] || el.tags['addr:district'] || el.tags['addr:state'])) || ''
        
        return {
          id: `osm-${el.type}-${el.id}`,
          osmId: el.id,
          name, city,
          lat: elLat, lng: elLng,
          verified: false,
          isFromAPI: true,
          times: null,
          events: [],
          image: `https://placehold.co/600x400/10b981/ffffff?text=${encodeURIComponent(name.substring(0, 18))}`
        }
      })
      .filter(Boolean)
  } catch (error) {
    console.error('Overpass error:', error)
    return []
  }
}

// Search masjids by city/name using Nominatim geocoding + Overpass
const searchByLocation = async (query) => {
  try {
    // First geocode the search query to get coordinates
    const geocodeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
      { headers: { 'User-Agent': 'ApniMasjid/1.0 (web.wise0123@gmail.com)' } }
    )
    
    if (!geocodeResponse.ok) return []
    const geocodeData = await geocodeResponse.json()
    
    if (geocodeData.length === 0) return []
    
    const { lat, lon } = geocodeData[0]
    
    // Now search for masjids in that area
    return await fetchFromOverpass(parseFloat(lat), parseFloat(lon), 15000)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

const handleMasjidClick = (masjid) => {
  // Cache masjid data so detail view can load it
  localStorage.setItem(`masjid-${masjid.id}`, JSON.stringify(masjid))
  router.push(`/masjid/${masjid.id}`)
}

const loadMore = () => {
  displayCount.value += 20
}

const clearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  displayCount.value = 20
  // Reload nearby masjids
  fetchInitialMasjids()
}

// Search action
const searchMasjids = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) return
  
  loading.value = true
  loadingMessage.value = `Searching for "${searchQuery.value}"...`
  hasSearched.value = true
  displayCount.value = 20
  
  try {
    // Search by name in existing loaded masjids first
    const query = searchQuery.value.toLowerCase()
    const localResults = allMasjids.value.filter(m => 
      m.name.toLowerCase().includes(query) || 
      (m.city && m.city.toLowerCase().includes(query))
    )
    
    // Also search via Overpass (geocode city → fetch nearby masjids)
    const apiResults = await searchByLocation(searchQuery.value)
    
    const apiWithDistance = apiResults.map(m => {
      const dist = calculateDistance(userLocation.value.lat, userLocation.value.lng, m.lat, m.lng)
      return { ...m, distance: dist.toFixed(1), rawDistance: dist }
    })
    
    // Merge and deduplicate
    const existingIds = new Set(localResults.map(m => m.id))
    const newResults = apiWithDistance.filter(m => !existingIds.has(m.id))
    
    allMasjids.value = [...localResults, ...newResults].sort((a, b) => a.rawDistance - b.rawDistance)
  } catch (err) {
    console.error('Search error:', err)
  }
  
  loading.value = false
}

// Initial load — nearby masjids
const fetchInitialMasjids = async () => {
  loading.value = true
  loadingMessage.value = 'Finding nearby masjids...'
  
  // Try to get user location
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    })
    userLocation.value = { lat: position.coords.latitude, lng: position.coords.longitude }
  } catch {
    console.log('Using default location (Mumbai)')
  }

  let results = []

  // 1. Community masjids from JSON
  loadingMessage.value = 'Loading community masjids...'
  const localMasjids = masjidsData.map(m => {
    const dist = calculateDistance(userLocation.value.lat, userLocation.value.lng, m.lat, m.lng)
    return { ...m, distance: dist.toFixed(2), rawDistance: dist, isFromAPI: false, city: m.city || '' }
  })
  results = [...localMasjids]

  // 2. Fetch from Overpass API — larger radius to get 20+ masjids
  loadingMessage.value = 'Finding nearby masjids from OpenStreetMap...'
  try {
    const overpassMasjids = await fetchFromOverpass(userLocation.value.lat, userLocation.value.lng, 15000) // 15km radius
    
    const overpassWithDistance = overpassMasjids.map(m => {
      const dist = calculateDistance(userLocation.value.lat, userLocation.value.lng, m.lat, m.lng)
      return { ...m, distance: dist.toFixed(2), rawDistance: dist }
    })
    
    // Deduplicate
    const deduplicated = overpassWithDistance.filter(osm => {
      return !results.some(db => calculateDistance(osm.lat, osm.lng, db.lat, db.lng) < 0.05)
    })
    
    results = [...results, ...deduplicated]
  } catch (err) {
    console.error('Overpass error:', err)
  }

  // Sort by distance
  results.sort((a, b) => a.rawDistance - b.rawDistance)
  
  allMasjids.value = results
  loading.value = false
}

// Computed filters
const filteredMasjids = computed(() => {
  let result = allMasjids.value
  
  if (sourceFilter.value === 'nearby') {
    result = result.filter(m => m.isFromAPI)
  } else if (sourceFilter.value === 'community') {
    result = result.filter(m => !m.isFromAPI)
  }
  
  // Local text filter (for instant filtering without API call)
  if (searchQuery.value && searchQuery.value.length >= 1 && !hasSearched.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(q) || 
      (m.city && m.city.toLowerCase().includes(q))
    )
  }
  
  return result
})

const displayedMasjids = computed(() => {
  return filteredMasjids.value.slice(0, displayCount.value)
})

const totalCount = computed(() => filteredMasjids.value.length)
const nearbyCount = computed(() => allMasjids.value.filter(m => m.isFromAPI).length)
const communityCount = computed(() => allMasjids.value.filter(m => !m.isFromAPI).length)

// Infinite scroll
const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY
  const docHeight = document.documentElement.scrollHeight
  
  if (scrollBottom >= docHeight - 300 && displayedMasjids.value.length < filteredMasjids.value.length) {
    displayCount.value += 10
  }
}

onMounted(() => {
  fetchInitialMasjids()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Reset display count when filter changes
watch(sourceFilter, () => {
  displayCount.value = 20
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
