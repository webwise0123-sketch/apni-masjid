<template>
  <!-- Install Banner — slides up from bottom -->
  <Transition name="slide-up">
    <div 
      v-if="showBanner" 
      class="fixed bottom-20 left-3 right-3 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-black/20 border border-gray-100 dark:border-gray-700 overflow-hidden">
        <!-- Top accent bar -->
        <div class="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
        
        <div class="p-4">
          <div class="flex items-start gap-3">
            <!-- App Icon -->
            <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
              <span class="text-white text-2xl font-bold">🕌</span>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm">Install Apni Masjid</h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ installMessage }}</p>
                </div>
                <!-- Close button -->
                <button 
                  @click="dismissBanner" 
                  class="p-1 -mr-1 -mt-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <XIcon class="w-4 h-4" />
                </button>
              </div>
              
              <!-- Device-specific content -->
              <div class="mt-3 flex gap-2">
                <!-- Android / Chrome — native install -->
                <button 
                  v-if="platform === 'android' || platform === 'desktop'"
                  @click="installApp"
                  class="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-xl text-xs font-bold hover:bg-emerald-700 active:scale-[0.97] transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <DownloadIcon class="w-3.5 h-3.5" />
                  Install App
                </button>
                
                <!-- iOS — manual instructions  -->
                <button 
                  v-if="platform === 'ios'"
                  @click="showIOSInstructions = true"
                  class="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-xl text-xs font-bold hover:bg-emerald-700 active:scale-[0.97] transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                >
                  <DownloadIcon class="w-3.5 h-3.5" />
                  Add to Home Screen
                </button>
                
                <button 
                  @click="dismissBanner"
                  class="px-4 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- iOS Instructions Modal -->
  <Transition name="fade">
    <div v-if="showIOSInstructions" class="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="showIOSInstructions = false"></div>
      
      <div class="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div class="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"></div>
        
        <div class="p-6">
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Install on {{ deviceName }}</h2>
            <button @click="showIOSInstructions = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Step by step instructions -->
          <div class="space-y-4">
            <!-- Step 1 -->
            <div class="flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">1</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Tap the <span class="inline-flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-bold">
                    <ShareIOSIcon class="w-3.5 h-3.5" /> Share
                  </span> button
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {{ isSafari ? 'At the bottom of Safari' : 'In the browser menu' }}
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">2</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Scroll and tap <span class="inline-flex items-center gap-0.5 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-bold">
                    <PlusSquareIcon class="w-3.5 h-3.5" /> Add to Home Screen
                  </span>
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  You may need to scroll down in the share menu
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex gap-3 items-start">
              <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <span class="text-emerald-600 dark:text-emerald-400 font-bold text-sm">3</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Tap <span class="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded text-xs font-bold">Add</span> to confirm
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Apni Masjid will appear on your home screen!
                </p>
              </div>
            </div>
          </div>

          <!-- Visual indicator pointing down (for Safari bottom bar) -->
          <div v-if="isSafari && platform === 'ios'" class="mt-5 flex justify-center">
            <div class="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 animate-bounce">
              <span class="text-xs">Share button is below</span>
              <ChevronDownIcon class="w-5 h-5" />
            </div>
          </div>

          <button 
            @click="showIOSInstructions = false; dismissBanner()"
            class="w-full mt-5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { XIcon, DownloadIcon, ChevronDownIcon, Share2Icon as ShareIOSIcon, PlusSquareIcon } from 'lucide-vue-next'

const showBanner = ref(false)
const showIOSInstructions = ref(false)
const deferredPrompt = ref(null)

// ========== Platform Detection ==========
const userAgent = navigator.userAgent || ''
const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
const isAndroid = /Android/.test(userAgent)
const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

const platform = computed(() => {
  if (isIOS) return 'ios'
  if (isAndroid) return 'android'
  return 'desktop'
})

const deviceName = computed(() => {
  if (isIOS) {
    if (/iPad/.test(userAgent)) return 'iPad'
    return 'iPhone'
  }
  if (isAndroid) return 'Android'
  return 'your device'
})

const installMessage = computed(() => {
  if (platform.value === 'ios') return 'Add to your home screen for quick access'
  if (platform.value === 'android') return 'Install for offline access & push notifications'
  return 'Install for a native desktop experience'
})

// ========== Install Logic ==========
const DISMISS_KEY = 'pwa-install-dismissed'
const DISMISS_DURATION = 3 * 24 * 60 * 60 * 1000 // 3 days

const wasDismissed = () => {
  const dismissed = localStorage.getItem(DISMISS_KEY)
  if (!dismissed) return false
  const dismissedAt = parseInt(dismissed, 10)
  if (Date.now() - dismissedAt > DISMISS_DURATION) {
    localStorage.removeItem(DISMISS_KEY)
    return false
  }
  return true
}

const dismissBanner = () => {
  showBanner.value = false
  localStorage.setItem(DISMISS_KEY, Date.now().toString())
}

const installApp = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      showBanner.value = false
      localStorage.setItem(DISMISS_KEY, Date.now().toString())
    }
    
    deferredPrompt.value = null
  }
}

// ========== Event Listeners ==========
const handleBeforeInstallPrompt = (e) => {
  e.preventDefault()
  deferredPrompt.value = e
  
  // Show banner after a short delay (don't interrupt first load)
  if (!wasDismissed() && !isStandalone) {
    setTimeout(() => {
      showBanner.value = true
    }, 2000)
  }
}

const handleAppInstalled = () => {
  showBanner.value = false
  deferredPrompt.value = null
  localStorage.setItem(DISMISS_KEY, Date.now().toString())
}

onMounted(() => {
  // Don't show if already installed as PWA
  if (isStandalone) return
  
  // Don't show if recently dismissed
  if (wasDismissed()) return
  
  // Listen for the native install prompt (Chrome, Edge, Samsung Browser, etc.)
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
  
  // For iOS (no beforeinstallprompt support) — show after delay
  if (isIOS && !isStandalone) {
    setTimeout(() => {
      if (!wasDismissed()) {
        showBanner.value = true
      }
    }, 3000)
  }
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
/* Slide up animation */
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.7, 0, 0.84, 0);
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Fade animation for modal */
.fade-enter-active {
  transition: opacity 0.3s ease;
}
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
