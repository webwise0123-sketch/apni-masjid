<template>
  <div class="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">New Post</h1>
    
    <!-- Running Notification -->
    <div class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-3 mb-6 border border-blue-100 dark:border-blue-800">
       <InfoIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
       <div>
         <p class="text-sm text-blue-800 dark:text-blue-200 font-medium">Please post accurate information.</p>
         <p class="text-xs text-blue-600 dark:text-blue-300 mt-1">
            Misleading updates affect everyone's time and prayers. Ensure verified details before posting.
         </p>
       </div>
    </div>

    <div v-if="settingsStore.isLoggedIn" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in duration-300">
      
      <!-- Post Type Toggle -->
      <div class="flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
         <button 
           @click="postType = 'update'"
           :class="['flex-1 py-2 text-xs font-bold rounded-md transition-all', postType === 'update' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400']"
         >
           Update
         </button>
         <button 
           @click="postType = 'event'"
           :class="['flex-1 py-2 text-xs font-bold rounded-md transition-all', postType === 'event' ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400']"
         >
           Event
         </button>
      </div>

      <div class="flex gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0 border border-emerald-200 dark:border-emerald-700">
          {{ getInitials(settingsStore.user.name) }}
        </div>
        <div class="flex-1">
           <p class="font-bold text-gray-800 dark:text-gray-100 text-sm">{{ settingsStore.user.name }}</p>
           
           <!-- Masjid Selector -->
           <div class="relative mt-1">
             <select 
               v-model="selectedMasjid"
               class="w-full text-xs text-emerald-600 dark:text-emerald-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md py-1.5 pl-2 pr-6 outline-none appearance-none cursor-pointer"
             >
               <option disabled value="">Select Nearby Masjid</option>
               <option v-for="masjid in masjidsData" :key="masjid.id" :value="masjid.name">
                 {{ masjid.name }} ({{ masjid.city || 'Mumbai' }})
               </option>
             </select>
             <ChevronDownIcon class="w-3 h-3 text-emerald-600 dark:text-emerald-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
           </div>
        </div>
      </div>

      <textarea 
        v-model="content"
        :placeholder="postType === 'event' ? 'Event details (Title, Time, Date)...' : 'What\'s happening in the masjid?'" 
        class="w-full h-32 p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 rounded-lg border-none resize-none focus:ring-1 focus:ring-emerald-500 text-sm mb-4 placeholder-gray-400 dark:placeholder-gray-500"
      ></textarea>

      <div v-if="success" class="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm rounded-lg flex items-center gap-2 animate-in fade-in duration-300">
        <CheckCircleIcon class="w-4 h-4" /> Posted successfully!
      </div>
      
      <!-- Info Label Preview -->
      <div v-if="content && selectedMasjid" class="mb-4 pt-3 border-t border-gray-100 dark:border-gray-700">
         <p class="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-1">Preview Label</p>
         <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <InfoIcon class="w-3 h-3" />
            <span>Posted by <span class="font-bold text-gray-700 dark:text-gray-300">{{ settingsStore.user.name }}</span> on {{ new Date().toLocaleDateString() }} for {{ selectedMasjid }}</span>
         </div>
      </div>

      <div class="flex items-center justify-between">
         <div class="flex gap-2 text-gray-400 dark:text-gray-500">
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><ImageIcon class="w-5 h-5" /></button>
            <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><MapPinIcon class="w-5 h-5" /></button>
         </div>
         <button 
           @click="submitPost"
           :disabled="!content || !selectedMasjid || loading"
           class="bg-emerald-600 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
         >
           <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
           {{ loading ? 'Posting...' : 'Post' }}
         </button>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-64 text-center">
       <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <LockIcon class="w-8 h-8" />
       </div>
       <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Login Required</h3>
       <p class="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-[250px]">You need to be logged in to post updates about your masjid.</p>
       <button 
          @click="isLoginOpen = true"
          class="bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 hover:bg-emerald-700 transition-all"
       >
          Login to Post
       </button>
    </div>

    <!-- Login Modal -->
    <LoginModal :isOpen="isLoginOpen" @close="isLoginOpen = false" @login-success="isLoginOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ImageIcon, MapPinIcon, Loader2Icon, CheckCircleIcon, LockIcon, InfoIcon, ChevronDownIcon } from 'lucide-vue-next'
import LoginModal from '../components/LoginModal.vue'
import { useSettingsStore } from '../stores/settings'
import masjidsData from '../data/masjids.json'

const content = ref('')
const loading = ref(false)
const success = ref(false)
const isLoginOpen = ref(false)
const postType = ref('update') // 'update' or 'event'
const selectedMasjid = ref('')
const settingsStore = useSettingsStore()

const getInitials = (name) => {
   return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ME'
}

const submitPost = async () => {
    if (!content.value || !selectedMasjid.value) return
    
    loading.value = true
    success.value = false
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    loading.value = false
    success.value = true
    content.value = ''
    // selectedMasjid.value = '' // Optional: reset selection
    
    setTimeout(() => {
        success.value = false
    }, 3000)
}
</script>
