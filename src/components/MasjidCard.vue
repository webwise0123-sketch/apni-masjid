<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-50 dark:border-gray-700 active:scale-98 transition-transform cursor-pointer hover:shadow-md">
    <div class="flex justify-between items-start mb-3">
      <div class="flex gap-3">
         <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
            <img :src="masjid.image || 'https://via.placeholder.com/50'" alt="Masjid" class="w-full h-full object-cover">
         </div>
         <div>
            <h3 class="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1">
              {{ masjid.name }}
              <BadgeCheckIcon v-if="masjid.verified" class="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-900" />
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
               <NavigationIcon class="w-3 h-3" /> {{ masjid.distance }} km away
            </p>
         </div>
      </div>
      <div class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-1 rounded-md font-medium border border-emerald-100 dark:border-emerald-800">
         Open
      </div>
    </div>
    
    <div class="grid grid-cols-5 gap-1 text-center mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
       <div v-for="(time, name) in masjid.times" :key="name" class="flex flex-col items-center">
          <span :class="['text-[10px] font-medium uppercase', isNextJamat(name, time) ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500']">{{ name.slice(0, 3) }}</span>
          <span :class="['text-xs', isNextJamat(name, time) ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-gray-600 dark:text-gray-400']">{{ formatTime(time) }}</span>
       </div>
    </div>
  </div>
</template>

<script setup>
import { BadgeCheckIcon, NavigationIcon } from 'lucide-vue-next'

const props = defineProps({
  masjid: {
    type: Object,
    required: true
  }
})

// Helper check for next jamat highlight (mocked logic for prototype)
// Ideally this would parse the time string and compare with current time
const isNextJamat = (name, time) => {
   // Hardcoded logic for demo purposes based on 'Maghrib' request hint
   return name === 'Maghrib'
}

const formatTime = (timeStr) => {
    return timeStr.replace(' AM', '').replace(' PM', '')
}
</script>
