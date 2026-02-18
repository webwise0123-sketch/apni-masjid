<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 transition-colors duration-300">
    <div class="grid grid-cols-4 h-16 max-w-lg mx-auto">
      <router-link to="/" class="nav-item group" active-class="active">
        <div class="icon-container mb-1 group-active:scale-95 transition-transform">
           <HomeIcon class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium tracking-wide">Namaz</span>
      </router-link>
      
      <router-link to="/trending" class="nav-item group" active-class="active">
        <div class="icon-container mb-1 group-active:scale-95 transition-transform">
           <TrendingUpIcon class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium tracking-wide">Trending</span>
      </router-link>
      
      <router-link to="/add-post" class="nav-item group" active-class="active">
        <div class="icon-container mb-1 group-active:scale-95 transition-transform">
           <PlusSquareIcon class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium tracking-wide">Add Post</span>
      </router-link>
      
      <router-link to="/settings" class="nav-item group" active-class="active">
        <div class="icon-container mb-1 group-active:scale-95 transition-transform">
           <SettingsIcon class="w-6 h-6" />
        </div>
        <span class="text-[10px] font-medium tracking-wide">Settings</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { HomeIcon, TrendingUpIcon, PlusSquareIcon, SettingsIcon } from 'lucide-vue-next'
</script>

<style scoped>
.nav-item {
  @apply flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer;
}

.nav-item.active {
  @apply text-emerald-600 dark:text-emerald-400;
}

.nav-item.active svg {
  @apply fill-emerald-100/50 stroke-emerald-600 dark:stroke-emerald-400;
}

.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
