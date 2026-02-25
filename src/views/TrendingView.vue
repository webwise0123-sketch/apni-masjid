<template>
  <div class="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <div class="flex justify-between items-center mb-6">
       <div>
         <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FlameIcon class="w-6 h-6 text-orange-500 fill-orange-500/20" /> Trending
         </h1>
         <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1 font-medium">
            <NavigationIcon class="w-3 h-3 text-emerald-500" /> {{ userAddress }}
         </p>
       </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
       <div class="relative">
         <div class="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
         <div class="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
       </div>
       <p class="text-sm text-gray-400 dark:text-gray-500">Discovering nearby updates...</p>
    </div>

    <!-- Empty/No Data State -->
    <div v-else-if="!loading && displayedPosts.length === 0" class="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
       <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
          <WindIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
       </div>
       <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">It's quiet around here</h3>
       <p class="text-sm text-gray-500 dark:text-gray-400 max-w-[250px]">
          No trending updates or events happening in your area right now.
       </p>
       <button @click="$router.push('/add-post')" class="mt-6 font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-6 py-2.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition">
          Be the first to post
       </button>
    </div>

    <!-- Posts Feed -->
    <div v-else class="space-y-4">
      <div v-for="post in displayedPosts" :key="post.id" class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in duration-500">
        <!-- Post Header -->
        <div class="flex items-start justify-between mb-3">
           <div class="flex items-center gap-3">
             <img :src="post.avatar" alt="User" class="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-600 shadow-sm" />
             <div>
               <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1">
                  {{ post.user }} 
                  <CheckCircleIcon v-if="post.verified" class="w-3.5 h-3.5 text-blue-500" />
               </h3>
               <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                  <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ post.masjid }}</span>
                  <span>•</span>
                  {{ post.distance }} km
               </p>
             </div>
           </div>
           <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-800">{{ post.time }}</span>
        </div>
        
        <!-- Post Content -->
        <p class="text-gray-800 dark:text-gray-200 text-sm mb-4 leading-relaxed font-medium">
          {{ post.content }}
        </p>

        <!-- Post Event Card Attachment -->
        <div v-if="post.type === 'event'" class="mb-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-3 flex gap-3">
           <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400 flex-shrink-0">
              <span class="text-[10px] font-bold uppercase">{{ post.eventMonth }}</span>
              <span class="text-base font-black leading-none">{{ post.eventDay }}</span>
           </div>
           <div>
              <p class="text-xs font-bold text-gray-900 dark:text-gray-100 line-clamp-1">{{ post.eventTitle }}</p>
              <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                 <ClockIcon class="w-3 h-3" /> {{ post.eventTime }}
              </p>
           </div>
        </div>

        <div v-if="post.image" class="mb-4 rounded-xl overflow-hidden h-48 w-full bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <img :src="post.image" alt="Post Image" class="w-full h-full object-cover">
        </div>

        <!-- Post Actions -->
        <div class="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs border-t border-gray-50 dark:border-gray-700 pt-3">
          <button @click="likePost(post)" :class="{'text-rose-500': post.liked}" class="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors font-medium">
            <HeartIcon :class="['w-4 h-4 transition-transform', {'fill-rose-500 scale-110': post.liked}]" /> 
            {{ post.likes }}
          </button>
          <button @click="openComments" class="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors font-medium">
            <MessageCircleIcon class="w-4 h-4" /> {{ post.comments }}
          </button>
          <button @click="sharePost(post)" class="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-full transition-colors font-medium">
            <Share2Icon class="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { HeartIcon, MessageCircleIcon, Share2Icon, FlameIcon, WindIcon, CheckCircleIcon, NavigationIcon, ClockIcon } from 'lucide-vue-next'

const posts = ref([])
const loading = ref(true)

// Geolocation
const userLocation = ref({ lat: 19.076, lng: 72.8777 }) // default 
const userAddress = ref("Locating...")
let isDefaultLocation = false

// Paging
const displayLimit = ref(10)
const totalPosts = computed(() => posts.value.length)
const displayedPosts = computed(() => posts.value.slice(0, displayLimit.value))

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const getUserLocation = async () => {
   return new Promise((resolve) => {
      if (!navigator.geolocation) {
         isDefaultLocation = true
         userAddress.value = "Default Area"
         resolve()
         return
      }

      navigator.geolocation.getCurrentPosition(
         async (pos) => {
            userLocation.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
            userAddress.value = "Your Local Area"
            resolve()
         },
         () => {
            isDefaultLocation = true
            userAddress.value = "Default Region"
            resolve()
         },
         { timeout: 5000 }
      )
   })
}

// Generate intelligent contextual data since DB is down during prototype presentation
const generateContextualPosts = () => {
    const lat = userLocation.value.lat
    const lng = userLocation.value.lng
    const generated = []
    
    // We create realistic mock posts radiating outwards from the user
    const MOCK_DATA = [
       { u: "Imran S.", m: "Jama Masjid", t: "update", c: "Juma bayan will start at exactly 1:15 PM today.", hr: 1, v: true },
       { u: "Apni Masjid Admin", m: "Madina Masjid", t: "event", eTitle: "Tafseer Session", eDay: "26", eMonth: "FEB", eTime: "After Maghrib", c: "Join us for our weekly Tafseer series covering Surah Yaseen.", hr: 3, v: true },
       { u: "Tariq P.", m: "Makkah Mosque", t: "update", c: "Masjid expansion fund has reached its goal! JazakAllah to everyone.", hr: 5, v: false },
       { u: "Anonymous", m: "Noorani Masjid", t: "update", c: "Wudu area is currently under maintenance. Please come with Wudu if possible.", hr: 12, v: false },
       { u: "Zayed R.", m: "Aqsa Masjid", t: "event", eTitle: "Youth Gather", eDay: "01", eMonth: "MAR", eTime: "3:00 PM", c: "Community sports and gathering for the youth this weekend.", hr: 24, v: true },
       { u: "Bilal K.", m: "Rahmania Masjid", t: "update", c: "New carpets have been laid out inside the main hall.", hr: 48, v: false },
    ]

    MOCK_DATA.forEach((data, index) => {
       // Distribute distance 
       const distanceKm = Math.pow(index + 1, 1.5) * 0.8; // 0.8km, 2.2km, 4.1km, 6.4km...
       // Mock coords
       const r = distanceKm * (1 / 111);
       const targetLat = lat + r;
       const targetLng = lng + r;
       
       const date = new Date()
       date.setHours(date.getHours() - data.hr)

       generated.push({
          id: `post-${index}`,
          user: data.u,
          masjid: data.m,
          lat: targetLat,
          lng: targetLng,
          rawDistance: distanceKm,
          distance: distanceKm.toFixed(1),
          type: data.t,
          content: data.c,
          verified: data.v,
          eventTitle: data.eTitle || null,
          eventDay: data.eDay || null,
          eventMonth: data.eMonth || null,
          eventTime: data.eTime || null,
          time: data.hr < 24 ? `${data.hr}h ago` : `${Math.floor(data.hr/24)}d ago`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.u)}&background=10b981&color=fff&font-size=0.4&bold=true`,
          likes: Math.floor(Math.random() * 50) + Math.floor(200 / (index+1)),
          comments: Math.floor(Math.random() * 15),
          liked: false
       })
    })
    
    // Check if any posts were injected locally via "Add Post"
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.startsWith('masjid-')) {
            try {
               const savedMasjid = JSON.parse(localStorage.getItem(key))
               if (savedMasjid.events && savedMasjid.events.length > 0) {
                  savedMasjid.events.forEach((eve, eIdx) => {
                     const realDist = calculateDistance(lat, lng, savedMasjid.lat, savedMasjid.lng)
                     generated.push({
                        id: `local-event-${eIdx}-${savedMasjid.name}`,
                        user: "You (Local)",
                        masjid: savedMasjid.name,
                        rawDistance: realDist,
                        distance: realDist.toFixed(1),
                        type: 'event',
                        content: eve.description || eve.title,
                        verified: true,
                        eventTitle: eve.title,
                        eventDay: new Date().getDate().toString(),
                        eventMonth: new Date().toLocaleString('default', { month: 'short' }),
                        eventTime: eve.time || 'TBD',
                        time: 'Just now',
                        avatar: `https://ui-avatars.com/api/?name=You&background=0284c7&color=fff&bold=true`,
                        likes: 0,
                        comments: 0,
                        liked: false
                     })
                  })
               }
            } catch(e) {}
        }
    }

    // Sort by near -> far
    return generated.sort((a, b) => a.rawDistance - b.rawDistance);
}

const loadFeed = async () => {
    loading.value = true
    await getUserLocation()
    
    // Build feed algorithmically from nearest user outward
    posts.value = generateContextualPosts()
    
    loading.value = false
}

const likePost = (post) => {
   post.liked = !post.liked
   post.likes += post.liked ? 1 : -1
}

const openComments = () => {
   alert("Comments will be available soon!")
}

const sharePost = async (post) => {
   const shareData = {
     title: `Update at ${post.masjid}`,
     text: `${post.content} - via Apni Masjid App`,
     url: window.location.href
   }
   if (navigator.share) await navigator.share(shareData)
   else {
      navigator.clipboard.writeText(shareData.text)
      alert("Text copied to clipboard!")
   }
}

// Infinite Scroll
const handleScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY
  const docHeight = document.documentElement.scrollHeight
  
  if (scrollBottom >= docHeight - 100 && displayLimit.value < totalPosts.value) {
    displayLimit.value += 5 // Load next 5
  }
}

onMounted(() => {
    loadFeed()
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>
