<template>
  <div class="pb-24 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <!-- Header with Back Button -->
    <header class="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 px-4 h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
        <ArrowLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg text-gray-800 dark:text-gray-100 truncate px-4">{{ loading ? 'Loading...' : (masjid?.name || 'Masjid Details') }}</h1>
      <div class="w-10"></div>
    </header>

    <!-- Content -->
    <div class="mt-14">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="relative">
          <div class="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div class="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Loading masjid details...</p>
      </div>

      <div v-else-if="masjid" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Hero Image -->
        <div class="relative h-64 w-full bg-gray-200 dark:bg-gray-800">
          <img :src="masjid.image" alt="Masjid Image" class="w-full h-full object-cover" @error="handleImageError" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 right-4 text-white">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span v-if="masjid.verified" class="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                VERIFIED <BadgeCheckIcon class="w-3 h-3" />
              </span>
              <span v-if="masjid.isFromAPI" class="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <GlobeIcon class="w-3 h-3" /> OpenStreetMap
              </span>
            </div>
            <h2 class="text-2xl font-bold leading-tight">{{ masjid.name }}</h2>
            <p class="text-sm text-gray-200 flex items-center gap-1 mt-1">
              <MapPinIcon class="w-4 h-4" /> 
              {{ masjid.distance }} km away
              <span v-if="masjid.city" class="ml-1">· {{ masjid.city }}</span>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-around p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <button @click="openDirections" class="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400 active:scale-95 transition-transform">
            <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <NavigationIcon class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">Directions</span>
          </button>
          <button @click="shareMasjid" class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 active:scale-95 transition-transform">
            <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              <Share2Icon class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">Share</span>
          </button>
          <button @click="scrollToEvents" class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300 active:scale-95 transition-transform">
            <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              <CalendarIcon class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">Events</span>
          </button>
        </div>

        <!-- Standard Prayer Times from Aladhan API -->
        <div class="p-4">
          <div class="flex justify-between items-center mb-3">
             <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">🕌 Namaz Times</h3>
             <span v-if="prayerTimes" class="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
               Aladhan API · Today
             </span>
          </div>
          
          <!-- Loading prayer times -->
          <div v-if="loadingPrayer" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 rounded-full border-3 border-gray-200 dark:border-gray-700"></div>
              <div class="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500">Loading prayer times...</p>
          </div>

          <!-- Prayer times grid -->
          <div v-else-if="prayerTimes" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700">
            <div v-for="(time, name) in prayerTimes" :key="name" class="flex justify-between items-center p-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm" 
                     :class="isCurrentPrayer(name) ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'">
                  {{ getPrayerEmoji(name) }}
                </div>
                <span class="font-medium text-gray-600 dark:text-gray-300">{{ name }}</span>
              </div>
              <span :class="['font-bold px-3 py-1 rounded-lg text-sm', isCurrentPrayer(name) ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30' : 'text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700']">
                {{ time }}
              </span>
            </div>
          </div>

          <!-- Error state -->
          <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
            <p class="text-gray-400 dark:text-gray-500 text-sm">Could not load prayer times</p>
            <button @click="retryPrayerTimes" class="text-emerald-500 text-xs mt-2 hover:underline">Retry</button>
          </div>

          <p v-if="prayerTimes" class="text-[10px] text-gray-400 dark:text-gray-500 mt-2 ml-1 italic">
            Standard calculation times for this location. Actual jamat times may differ.
          </p>
        </div>

        <!-- Actual Jamat Timings (User-entered) -->
        <div class="p-4 pt-0">
          <div class="flex justify-between items-center mb-3">
             <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">🕐 Actual Jamat Timings</h3>
             <button 
               @click="handleEditClick"
               class="flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-full transition-colors"
               :class="isEditing ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
             >
                <div v-if="isEditing" class="flex gap-1 items-center">
                   <SaveIcon class="w-4 h-4" /> Save
                </div>
                <div v-else class="flex gap-1 items-center">
                   <PencilIcon class="w-4 h-4" /> Edit
                </div>
             </button>
          </div>
          
          <div v-if="hasJamatTimings || isEditing" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700">
            <div v-for="prayer in jamatPrayerNames" :key="prayer" class="flex justify-between items-center p-3.5">
              <span class="font-medium text-gray-600 dark:text-gray-300">{{ prayer }}</span>
              <div v-if="isEditing">
                  <input 
                     v-model="jamatTimings[prayer]" 
                     placeholder="e.g. 1:30 PM"
                     class="text-right font-bold text-gray-900 bg-gray-50 dark:bg-gray-600 dark:text-gray-100 px-2 py-1 rounded border border-gray-200 dark:border-gray-500 focus:border-emerald-500 outline-none w-28 placeholder:text-gray-300 dark:placeholder:text-gray-500 text-sm" 
                  />
              </div>
              <span v-else-if="jamatTimings[prayer]" class="font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg text-sm">{{ jamatTimings[prayer] }}</span>
              <span v-else class="text-gray-300 dark:text-gray-600 text-xs italic">Not set</span>
            </div>
          </div>

          <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
            <ClockIcon class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">No Jamat timings added yet</p>
            <p class="text-gray-300 dark:text-gray-600 text-xs mt-1">Login and tap Edit to add actual timings</p>
          </div>
        </div>

        <!-- Events Section -->
        <div class="p-4 pt-0" ref="eventsSection">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-3 text-lg">📅 Events</h3>
          
          <div v-if="masjid.events && masjid.events.length > 0" class="space-y-3">
             <div v-for="(event, idx) in masjid.events" :key="idx" class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <h4 class="font-bold text-emerald-900 dark:text-emerald-300">{{ event.title }}</h4>
                <div class="flex gap-4 mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                   <div class="flex items-center gap-1"><CalendarIcon class="w-4 h-4"/> {{ event.date }}</div>
                   <div class="flex items-center gap-1"><ClockIcon class="w-4 h-4"/> {{ event.time }}</div>
                </div>
             </div>
          </div>

          <!-- No Events State -->
          <div v-else class="bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
            <CalendarIcon class="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p class="text-gray-400 dark:text-gray-500 text-sm font-medium">No upcoming events</p>
            <p class="text-gray-300 dark:text-gray-600 text-xs mt-1">Events will be posted here when available</p>
          </div>
        </div>
      </div>
      
      <!-- Not Found State -->
      <div v-else class="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
         <div class="text-5xl mb-4">🕌</div>
         <p class="font-medium">Masjid not found</p>
         <p class="text-sm text-gray-400 mt-1">The masjid data may have expired</p>
         <button @click="$router.push('/')" class="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors">Go Home</button>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal :isOpen="isLoginOpen" @close="isLoginOpen = false" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, BadgeCheckIcon, MapPinIcon, NavigationIcon, Share2Icon, CalendarIcon, Loader2Icon, ClockIcon, PencilIcon, SaveIcon, GlobeIcon } from 'lucide-vue-next'
import masjidsData from '../data/masjids.json'
import LoginModal from '../components/LoginModal.vue'
import { useSettingsStore } from '../stores/settings'
import { supabase } from '../supabase'

const route = useRoute()
const masjid = ref(null)
const loading = ref(true)
const isLoginOpen = ref(false)
const isEditing = ref(false)
const settingsStore = useSettingsStore()
const prayerTimes = ref(null)
const loadingPrayer = ref(false)
const eventsSection = ref(null)

const jamatPrayerNames = ['Fajr', 'Zohar', 'Asar', 'Maghrib', 'Isha']

const jamatTimings = reactive({
  Fajr: '', Zohar: '', Asar: '', Maghrib: '', Isha: ''
})

const hasJamatTimings = computed(() => {
  return Object.values(jamatTimings).some(v => v && v.trim() !== '')
})

// ========== Aladhan API ==========
const fetchPrayerTimes = async (lat, lng) => {
  loadingPrayer.value = true
  try {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=1`
    )
    
    if (!response.ok) throw new Error('Aladhan API error')
    
    const data = await response.json()
    
    if (data.code === 200 && data.data && data.data.timings) {
      const t = data.data.timings
      prayerTimes.value = {
        'Fajr': t.Fajr,
        'Sunrise': t.Sunrise,
        'Dhuhr': t.Dhuhr,
        'Asr': t.Asr,
        'Maghrib': t.Maghrib,
        'Isha': t.Isha
      }
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error)
    prayerTimes.value = null
  } finally {
    loadingPrayer.value = false
  }
}

const retryPrayerTimes = () => {
  if (masjid.value) {
    fetchPrayerTimes(masjid.value.lat, masjid.value.lng)
  }
}

const getPrayerEmoji = (name) => {
  const emojis = { 'Fajr': '🌅', 'Sunrise': '☀️', 'Dhuhr': '🌞', 'Asr': '🌤️', 'Maghrib': '🌇', 'Isha': '🌙' }
  return emojis[name] || '🕌'
}

const isCurrentPrayer = (name) => {
  const now = new Date()
  const hours = now.getHours()
  if (hours < 6) return name === 'Fajr'
  if (hours < 7) return name === 'Sunrise'
  if (hours < 14) return name === 'Dhuhr'
  if (hours < 17) return name === 'Asr'
  if (hours < 19) return name === 'Maghrib'
  return name === 'Isha'
}

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400/10b981/ffffff?text=Masjid'
}

// ========== Load Masjid Details ==========
const fetchMasjidDetails = async () => {
   loading.value = true
   
   const masjidId = route.params.id
   
   // 1. Try localStorage cache first (works for both OSM and community masjids)
   const cached = localStorage.getItem(`masjid-${masjidId}`)
   if (cached) {
     try {
       const parsedMasjid = JSON.parse(cached)
       masjid.value = {
         ...parsedMasjid,
         events: parsedMasjid.events || []
       }
       
       // Load saved jamat timings
       const savedTimings = localStorage.getItem(`jamat-${masjidId}`)
       if (savedTimings) {
         Object.assign(jamatTimings, JSON.parse(savedTimings))
       } else if (parsedMasjid.times) {
         // Load times from masjid data
         Object.keys(parsedMasjid.times).forEach(key => {
           if (jamatTimings.hasOwnProperty(key)) {
             jamatTimings[key] = parsedMasjid.times[key]
           }
         })
       }
       
       // Fetch prayer times
       if (parsedMasjid.lat && parsedMasjid.lng) {
         fetchPrayerTimes(parsedMasjid.lat, parsedMasjid.lng)
       }
       
       loading.value = false
       return
     } catch (e) {
       console.error('Cache parse error:', e)
     }
   }
   
   // 2. Try local JSON data
   const numericId = Number(masjidId)
   if (!isNaN(numericId)) {
     const found = masjidsData.find(m => m.id === numericId)
     if (found) {
       masjid.value = {
         ...found,
         times: found.times ? { ...found.times } : null,
         distance: (Math.random() * 2 + 0.1).toFixed(1),
         isFromAPI: false,
         events: found.events || []
       }
       
       if (found.times) {
         Object.keys(found.times).forEach(key => {
           if (jamatTimings.hasOwnProperty(key)) jamatTimings[key] = found.times[key]
         })
       }
       
       const savedTimings = localStorage.getItem(`jamat-${masjidId}`)
       if (savedTimings) Object.assign(jamatTimings, JSON.parse(savedTimings))
       
       fetchPrayerTimes(found.lat, found.lng)
       loading.value = false
       return
     }
   }
   
   // 3. Try Supabase
   try {
     const { data, error } = await supabase.from('masjids').select('*').eq('id', numericId).single()
     if (!error && data) {
       masjid.value = {
         ...data,
         distance: '?',
         isFromAPI: false,
         events: data.events || []
       }
       if (data.times) {
         Object.keys(data.times).forEach(key => {
           if (jamatTimings.hasOwnProperty(key)) jamatTimings[key] = data.times[key]
         })
       }
       fetchPrayerTimes(data.lat, data.lng)
       loading.value = false
       return
     }
   } catch (e) {
     console.error('Supabase fetch error:', e)
   }
   
   // 4. Not found
   masjid.value = null
   loading.value = false
}

// ========== Actions ==========
const openDirections = () => {
  if (masjid.value) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${masjid.value.lat},${masjid.value.lng}&travelmode=walking`
    window.open(url, '_blank')
  }
}

const shareMasjid = async () => {
  if (!masjid.value) return
  
  const shareData = {
    title: masjid.value.name,
    text: `Check out ${masjid.value.name}${masjid.value.city ? ' in ' + masjid.value.city : ''} on Apni Masjid!`,
    url: window.location.href
  }
  
  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback: copy to clipboard
      const text = `${shareData.text}\n${shareData.url}`
      await navigator.clipboard.writeText(text)
      alert('Link copied to clipboard!')
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Share failed:', err)
      // Final fallback
      const text = `${shareData.text}\n${shareData.url}`
      try {
        await navigator.clipboard.writeText(text)
        alert('Link copied to clipboard!')
      } catch {
        alert('Could not share. Please copy the URL manually.')
      }
    }
  }
}

const scrollToEvents = () => {
  if (eventsSection.value) {
    eventsSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleEditClick = () => {
   if (!settingsStore.isLoggedIn) {
      isLoginOpen.value = true
      return
   }
   
   if (isEditing.value) {
      const masjidId = route.params.id
      localStorage.setItem(`jamat-${masjidId}`, JSON.stringify({ ...jamatTimings }))
      alert('Jamat timings saved! JazakAllah Khair.')
   }
   isEditing.value = !isEditing.value
}

const handleLoginSuccess = (user) => {
   settingsStore.login(user)
   isEditing.value = true
}

onMounted(() => {
   fetchMasjidDetails()
})
</script>
