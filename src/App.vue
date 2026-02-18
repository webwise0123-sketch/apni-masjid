<script setup>
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import { useSettingsStore } from './stores/settings'

const settingsStore = useSettingsStore()

// Apply theme immediately
const applyTheme = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

watch(() => settingsStore.isDarkMode, (newVal) => {
  applyTheme(newVal)
}, { immediate: true })

onMounted(() => {
  // Fix transition flicker on load
  document.documentElement.classList.add('transition-colors', 'duration-300')
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 font-sans text-gray-900 dark:text-gray-100">
    <RouterView />
    <BottomNav />
  </div>
</template>
