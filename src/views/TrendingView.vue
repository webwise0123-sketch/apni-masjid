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
import { ref, onMounted } from 'vue'
import { HeartIcon, MessageCircleIcon, Share2Icon } from 'lucide-vue-next'
import { supabase } from '../supabase'

const posts = ref([])
const loading = ref(true)

const fetchPosts = async () => {
    loading.value = true
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false })
            
        if (error) throw error
        
        if (data) {
            posts.value = data.map(post => ({
                id: post.id,
                user: post.user_name || 'Anonymous',
                masjid: post.masjid_name,
                time: new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: post.content,
                image: null, // Placeholder as we don't have image upload yet
                avatar: `https://ui-avatars.com/api/?name=${post.user_name || 'User'}&background=10b981&color=fff`,
                likes: post.likes || 0,
                comments: post.comments || 0
            }))
        }
    } catch (e) {
        console.error("Error fetching posts:", e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchPosts()
})
</script>
