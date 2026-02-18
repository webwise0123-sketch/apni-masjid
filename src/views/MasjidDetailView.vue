<template>
  <div class="pb-24 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <!-- Header with Back Button -->
    <header class="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 px-4 h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
        <ArrowLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="font-bold text-lg text-gray-800 dark:text-gray-100 truncate px-4">{{ loading ? 'Loading...' : (masjid?.name || 'Masjid Details') }}</h1>
      <div class="w-10"></div> <!-- Spacer for centering -->
    </header>

    <!-- Content -->
    <div class="mt-14">
      <div v-if="loading" class="p-8 flex justify-center">
        <Loader2Icon class="w-8 h-8 animate-spin text-emerald-500" />
      </div>

      <div v-else-if="masjid" class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <!-- Hero Image -->
        <div class="relative h-64 w-full bg-gray-200">
          <img :src="masjid.image" alt="Masjid Image" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-4 left-4 text-white">
            <div class="flex items-center gap-2 mb-1">
              <span v-if="masjid.verified" class="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                VERIFIED <BadgeCheckIcon class="w-3 h-3" />
              </span>
            </div>
            <h2 class="text-2xl font-bold">{{ masjid.name }}</h2>
            <p class="text-sm text-gray-200 flex items-center gap-1 mt-1">
              <MapPinIcon class="w-4 h-4" /> {{ masjid.distance }} km away
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-around p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <button class="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <div class="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <NavigationIcon class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">Directions</span>
          </button>
          <button class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
            <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              <Share2Icon class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">Share</span>
          </button>
          <button class="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-300">
            <div class="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              <CalendarIcon class="w-5 h-5" />
            </div>
            <span class="text-xs font-medium">Events</span>
          </button>
        </div>

        <!-- Namaz Times -->
        <div class="p-4">
          <div class="flex justify-between items-center mb-3">
             <h3 class="font-bold text-gray-800 dark:text-gray-100 text-lg">Namaz Times</h3>
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
          
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-50 dark:divide-gray-700">
            <div v-for="(time, name) in masjid.times" :key="name" class="flex justify-between items-center p-4">
              <span class="font-medium text-gray-600 dark:text-gray-300">{{ name }}</span>
              <div v-if="isEditing">
                  <input 
                     v-model="masjid.times[name]" 
                     class="text-right font-bold text-gray-900 bg-gray-50 dark:bg-gray-600 dark:text-gray-100 px-2 py-1 rounded border border-gray-200 dark:border-gray-500 focus:border-emerald-500 outline-none w-32" 
                  />
              </div>
              <span v-else class="font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">{{ time }}</span>
            </div>
          </div>
        </div>

        <!-- Events -->
        <div class="p-4 pt-0" v-if="masjid.events && masjid.events.length">
          <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-3 text-lg">Upcoming Events</h3>
          <div class="space-y-3">
             <div v-for="(event, idx) in masjid.events" :key="idx" class="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800">
                <h4 class="font-bold text-emerald-900 dark:text-emerald-300">{{ event.title }}</h4>
                <div class="flex gap-4 mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                   <div class="flex items-center gap-1"><CalendarIcon class="w-4 h-4"/> {{ event.date }}</div>
                   <div class="flex items-center gap-1"><ClockIcon class="w-4 h-4"/> {{ event.time }}</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
         <p>Masjid not found.</p>
         <button @click="$router.push('/')" class="mt-4 text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Go Home</button>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal :isOpen="isLoginOpen" @close="isLoginOpen = false" @login-success="handleLoginSuccess" />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, BadgeCheckIcon, MapPinIcon, NavigationIcon, Share2Icon, CalendarIcon, Loader2Icon, ClockIcon, PencilIcon, SaveIcon } from 'lucide-vue-next'
import masjidsData from '../data/masjids.json'
import LoginModal from '../components/LoginModal.vue'
import { useSettingsStore } from '../stores/settings'

const route = useRoute()
const masjid = ref(null)
const loading = ref(true)
const isLoginOpen = ref(false)
const isEditing = ref(false)
const settingsStore = useSettingsStore()

const fetchMasjidDetails = async () => {
   loading.value = true
   await new Promise(resolve => setTimeout(resolve, 600)) // Simulate network
   
   const found = masjidsData.find(m => m.id === Number(route.params.id))
   if (found) {
      masjid.value = {
          ...found,
          times: { ...found.times }, // Clone for editing safely
          distance: (Math.random() * 2 + 0.1).toFixed(1)
      }
   }
   loading.value = false
}

const handleEditClick = () => {
   if (!settingsStore.isLoggedIn) {
      isLoginOpen.value = true
      return
   }
   
   if (isEditing.value) {
      // Save Logic
   }
   isEditing.value = !isEditing.value
}

const handleLoginSuccess = (user) => {
   settingsStore.login(user)
   // Automatically start editing after login if they clicked edit
   isEditing.value = true
}

onMounted(() => {
   fetchMasjidDetails()
})
</script>
