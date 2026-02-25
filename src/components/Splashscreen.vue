<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      
      <!-- Elegant Pulse Ring Behind Logo -->
      <div class="relative flex items-center justify-center">
        <!-- Outer glow / pulse -->
        <div class="absolute w-32 h-32 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div class="absolute w-28 h-28 bg-emerald-500/30 dark:bg-emerald-500/20 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
        
        <!-- Logo Image -->
        <img 
          src="/logo.png" 
          alt="Apni Masjid Logo" 
          class="w-24 h-24 object-contain rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-10 animate-in zoom-in-50 fade-in duration-700 ease-out fill-mode-both"
        />
      </div>

      <!-- App Name with subtle slide-up -->
      <h1 class="mt-8 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 opacity-0 animate-[slideUp_0.8s_ease-out_forwards_0.4s]">
        Apni Masjid
      </h1>
      
      <p class="mt-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 opacity-0 animate-[slideUp_0.8s_ease-out_forwards_0.6s]">
        Connecting the Ummah
      </p>

    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const show = ref(true)

onMounted(() => {
  // Splash screen duration - 2.5 seconds total
  setTimeout(() => {
    show.value = false
  }, 2500)
})
</script>

<style scoped>
/* Vue Transition for the entire screen fade-out */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.6s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}

/* Custom CSS Keyframes for sequential sliding text */
@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
