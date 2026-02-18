<template>
  <div class="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Trending Updates</h1>
    
    <div class="space-y-4">
      <div v-for="post in posts" :key="post.id" class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div class="flex items-center gap-3 mb-3">
          <img :src="post.avatar" alt="User" class="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-600" />
          <div>
            <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ post.user }}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ post.time }} • {{ post.masjid }}</p>
          </div>
        </div>
        
        <p class="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
          {{ post.content }}
        </p>

        <div v-if="post.image" class="mb-3 rounded-lg overflow-hidden h-48 w-full bg-gray-100 dark:bg-gray-900">
          <img :src="post.image" alt="Post Image" class="w-full h-full object-cover">
        </div>

        <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs border-t border-gray-50 dark:border-gray-700 pt-3">
          <button class="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <HeartIcon class="w-4 h-4" /> {{ post.likes }}
          </button>
          <button class="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <MessageCircleIcon class="w-4 h-4" /> {{ post.comments }}
          </button>
          <button class="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <Share2Icon class="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { HeartIcon, MessageCircleIcon, Share2Icon } from 'lucide-vue-next'

const posts = ref([
  {
    id: 1,
    user: "Ahmed Khan",
    masjid: "Rahmania Masjid",
    time: "2 hours ago",
    content: "Alhamdulillah, the new carpet installation is complete! The masjid looks beautiful. Please join us for Maghrib today.",
    image: "https://placehold.co/600x400/10b981/ffffff?text=New+Carpet",
    avatar: "https://placehold.co/100x100/10b981/ffffff?text=AK",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    user: "Masjid Committee",
    masjid: "Jamia Masjid",
    time: "5 hours ago",
    content: "Correction: The Asar Jamat time has changed to 5:15 PM starting tomorrow. Please take note.",
    image: null,
    avatar: "https://placehold.co/100x100/059669/ffffff?text=MC",
    likes: 89,
    comments: 5
  },
   {
    id: 3,
    user: "Salim Merchant",
    masjid: "Nurul Islam",
    time: "1 day ago",
    content: "Who is attending the Tafsir session this Thursday? I can offer a ride to anyone from Kurla.",
    image: null,
    avatar: "https://placehold.co/100x100/047857/ffffff?text=SM",
    likes: 23,
    comments: 8
  }
])
</script>
