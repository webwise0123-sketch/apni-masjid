<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-sm max-h-[90vh] overflow-y-auto overflow-x-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-xl animate-in fade-in zoom-in-95 duration-300 no-scrollbar">
      <div class="p-6">
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3">
            <img src="/logo.png" alt="Apni Masjid" class="w-12 h-12 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div>
               <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 leading-none">Apni Masjid</h2>
               <p class="text-[10px] text-gray-500 font-medium tracking-wide uppercase mt-1">Connecting the Ummah</p>
            </div>
          </div>
          <button @click="close" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            <strong class="text-gray-800 dark:text-gray-100 font-semibold">Apni Masjid</strong> is an open platform built to modernize how Muslims discover and interact with their local Islamic centers.
          </p>
          <p>
            Our core mission is to solve a huge problem in today's digital age: <span class="italic text-emerald-600 dark:text-emerald-400 font-medium">Outdated or missing Jamat timings for local Mosques.</span>
          </p>
          <p>
            With Apni Masjid, the community is empowered to:
            <ul class="list-disc pl-5 mt-2 space-y-1">
              <li>Discover previously hidden, local neighborhood Masjids</li>
              <li>Instantly view highly accurate, real-time namaz timings validated by the community</li>
              <li>Add and verify masjids that are not on popular maps</li>
              <li>Support and grow the global Islamic network</li>
            </ul>
          </p>
          
          <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl mt-6 text-center border border-gray-100 dark:border-gray-600">
             <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Developed with ❤️ by</p>
             <p class="font-bold text-gray-800 dark:text-gray-100">Team Apni Masjid</p>
             <p class="text-[10px] text-gray-400 mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
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
