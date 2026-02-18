<template>
  <div class="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <h1 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Settings</h1>
    
    <div class="space-y-6">
       <!-- Profile Section -->
       <section class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xl font-bold border border-emerald-200 dark:border-emerald-700">
            {{ settingsStore.isLoggedIn ? getInitials(settingsStore.user.name) : '?' }}
          </div>
          <div>
             <h2 class="font-bold text-gray-900 dark:text-gray-100">{{ settingsStore.isLoggedIn ? settingsStore.user.name : 'Guest User' }}</h2>
             <p class="text-xs text-gray-500 dark:text-gray-400">{{ settingsStore.isLoggedIn ? settingsStore.user.address : 'Login to sync data' }}</p>
             <button 
                @click="handleAuthAction" 
                class="text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-1 hover:underline"
             >
                {{ settingsStore.isLoggedIn ? 'Log Out' : 'Login / Sign Up' }}
             </button>
          </div>
       </section>

       <!-- Preferences -->
       <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700">
          <div class="p-4 flex items-center justify-between">
             <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg"><BellIcon class="w-5 h-5" /></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Notifications</span>
             </div>
             <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
          </div>
          
          <div class="p-4 flex items-center justify-between">
             <div class="flex items-center gap-3">
                <div class="p-2 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg"><MoonIcon class="w-5 h-5" /></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
             </div>
             <label class="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    class="sr-only peer"
                    :checked="settingsStore.isDarkMode"
                    @change="settingsStore.toggleDarkMode"
                >
                <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
          </div>

          <div class="p-4 flex items-center justify-between">
             <div class="flex items-center gap-3">
                <div class="p-2 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 rounded-lg"><MapIcon class="w-5 h-5" /></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Location Access</span>
             </div>
             <span class="text-xs text-gray-400">Always</span>
          </div>
       </section>

       <!-- App Info -->
         <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden divide-y divide-gray-50 dark:divide-gray-700">
          <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
             <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"><HelpCircleIcon class="w-5 h-5" /></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Help & Support</span>
             </div>
          </div>
           <div class="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
             <div class="flex items-center gap-3">
                <div class="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"><InfoIcon class="w-5 h-5" /></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200">About Apni Masjid</span>
             </div>
          </div>
         </section>
         
         <div class="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
            v1.0.0 (Prototype)
         </div>
    </div>
    
    <LoginModal :isOpen="showLogin" @close="showLogin = false" @login-success="showLogin = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BellIcon, MoonIcon, MapIcon, HelpCircleIcon, InfoIcon } from 'lucide-vue-next'
import { useSettingsStore } from '../stores/settings'
import LoginModal from '../components/LoginModal.vue'

const settingsStore = useSettingsStore()
const showLogin = ref(false)

const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const handleAuthAction = () => {
    if (settingsStore.isLoggedIn) {
        if(confirm('Are you sure you want to log out?')) {
            settingsStore.logout()
        }
    } else {
        showLogin.value = true
    }
}
</script>
