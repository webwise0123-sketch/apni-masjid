<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-50 dark:border-gray-700 active:scale-[0.98] transition-all cursor-pointer hover:shadow-md mb-3">
    <div class="flex justify-between items-start mb-2">
      <div class="flex gap-3 flex-1 min-w-0">
         <div class="w-11 h-11 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">
            🕌
         </div>
         <div class="min-w-0 flex-1">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1 text-sm">
              <span class="truncate">{{ masjid.name }}</span>
              <BadgeCheckIcon v-if="masjid.verified" class="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
               <NavigationIcon class="w-3 h-3 flex-shrink-0" /> {{ masjid.distance }} km away
               <span v-if="masjid.city" class="text-gray-400 truncate">· {{ masjid.city }}</span>
            </p>
         </div>
      </div>
      <div :class="[
        'text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2',
        masjid.isFromAPI 
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
          : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300'
      ]">
         {{ masjid.isFromAPI ? 'Nearby' : 'Added' }}
      </div>
    </div>
    
    <!-- Actual Jamat Timings -->
    <div class="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
      <p class="text-[9px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Actual Jamat Timings</p>
      <div v-if="masjid.times && hasTimings" class="grid grid-cols-5 gap-1 text-center">
         <div v-for="(time, name) in masjid.times" :key="name" class="flex flex-col items-center">
            <span :class="['text-[9px] font-medium uppercase', isNextJamat(name) ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-gray-500']">{{ name.slice(0, 3) }}</span>
            <span :class="['text-[11px]', isNextJamat(name) ? 'text-emerald-700 dark:text-emerald-300 font-bold' : 'text-gray-600 dark:text-gray-400']">{{ formatTime(time) }}</span>
         </div>
      </div>
      <p v-else class="text-[11px] text-gray-300 dark:text-gray-600 italic">Not added yet — tap to view & add</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BadgeCheckIcon, NavigationIcon } from 'lucide-vue-next'

const props = defineProps({
  masjid: {
    type: Object,
    required: true
  }
})

const hasTimings = computed(() => {
  if (!props.masjid.times) return false
  return Object.values(props.masjid.times).some(v => v && typeof v === 'string' && v.trim() !== '')
})

const isNextJamat = (name) => {
   const now = new Date()
   const hours = now.getHours()
   if (hours < 6) return name === 'Fajr'
   if (hours < 14) return name === 'Zohar' || name === 'Dhuhr'
   if (hours < 17) return name === 'Asar' || name === 'Asr'
   if (hours < 19) return name === 'Maghrib'
   return name === 'Isha'
}

const formatTime = (timeStr) => {
    if (!timeStr) return '--'
    return timeStr.replace(' AM', '').replace(' PM', '')
}
</script>
