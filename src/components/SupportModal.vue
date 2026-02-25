<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-sm max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300 no-scrollbar">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <HeartIcon class="w-6 h-6 text-rose-500 fill-rose-500" /> Support Us
          </h2>
          <button @click="close" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            Assalamu Alaikum! <strong class="text-gray-800 dark:text-gray-100">Apni Masjid</strong> is a community-driven platform built to make it easier for Muslims to find nearby Masjids and accurate Jamat timings.
          </p>
          
          <div class="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
            <p class="text-amber-800 dark:text-amber-200 font-medium mb-2">Why we need your help</p>
            <p class="text-amber-700 dark:text-amber-300/80 text-xs">
              Currently, this app is running entirely on free versions of map APIs, servers, and hosting providers. To ensure the app stays fast, reliable, and online without strict rate limits, we need to upgrade to paid infrastructure.
            </p>
          </div>

          <p>
            Your donations go directly toward:
            <ul class="list-disc pl-5 mt-2 space-y-1 text-gray-500 dark:text-gray-400">
              <li>Premium Maps API for precise, fast search</li>
              <li>Faster, scalable backend servers</li>
              <li>Ongoing development costs and new features</li>
            </ul>
          </p>

          <!-- Payment Section -->
          <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">Donate Securely</h3>
            
            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center mb-4">
               <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">UPI ID</p>
               <div class="flex items-center justify-center gap-2 font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-white dark:bg-gray-800 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-600">
                 apnimasjid@upi 
                 <button @click="copyUPI" class="text-gray-400 hover:text-emerald-500 transition-colors" title="Copy UPI">
                    <CopyIcon class="w-4 h-4" />
                 </button>
               </div>
               <p v-if="copied" class="text-[10px] text-emerald-500 mt-1 font-medium transition-all">Copied to clipboard!</p>
            </div>

            <button class="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/30 active:scale-[0.98]">
              <WalletIcon class="w-5 h-5" /> Donate via Payment Gateway
            </button>
            <p class="text-[10px] text-center text-gray-400 dark:text-gray-500 mt-2">100% Secure & Encrypted Payments</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { XIcon, HeartIcon, CopyIcon, WalletIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const copied = ref(false)

const close = () => {
  emit('close')
  copied.value = false
}

const copyUPI = () => {
  navigator.clipboard.writeText('apnimasjid@upi')
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
