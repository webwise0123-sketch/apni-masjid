<template>
  <div class="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
    <!-- Header -->
    <header class="flex items-center gap-3 mb-6">
      <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
        <ArrowLeftIcon class="w-6 h-6" />
      </button>
      <h1 class="text-xl font-bold text-gray-800 dark:text-gray-100">Add New Masjid</h1>
    </header>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-in fade-in duration-300">
       
       <div class="mb-6 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg flex gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
          <InfoIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>You can add a masjid that isn't listed yet. Please ensure the location and details are accurate to help the community.</p>
       </div>

       <form @submit.prevent="submitMasjid" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 ml-1">Masjid Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              placeholder="e.g. Jama Masjid" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" 
            />
          </div>

          <!-- City -->
          <div>
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 ml-1">City / Area</label>
            <input 
              v-model="form.city" 
              type="text" 
              required
              placeholder="e.g. Bandra, Mumbai" 
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white" 
            />
          </div>

           <!-- Location Fetcher -->
           <div>
              <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1.5 ml-1">Location</label>
              <div class="flex gap-2">
                 <div class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900/50 rounded-xl text-gray-500 dark:text-gray-400 text-sm flex items-center justify-between">
                    <span>{{ locationStatus }}</span>
                    <CheckCircleIcon v-if="form.lat" class="w-4 h-4 text-emerald-500" />
                 </div>
                 <button 
                   type="button" 
                   @click="getLocation"
                   class="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-4 rounded-xl font-medium text-sm hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                 >
                    <MapPinIcon ::class="{'animate-pulse': gettingLocation}" class="w-5 h-5" />
                 </button>
              </div>
              <p class="text-[10px] text-gray-400 mt-1 ml-1">Tap the pin to fetch your current GPS location.</p>
           </div>

           <!-- Submit Button -->
           <button 
             type="submit" 
             :disabled="loading || !form.lat"
             class="w-full mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
           >
             <Loader2Icon v-if="loading" class="w-5 h-5 animate-spin" />
             {{ loading ? 'Submitting...' : 'Add Masjid' }}
           </button>
       </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, MapPinIcon, InfoIcon, Loader2Icon, CheckCircleIcon } from 'lucide-vue-next'

const router = useRouter()
const loading = ref(false)
const gettingLocation = ref(false)
const locationStatus = ref('Location required')

const form = reactive({
  name: '',
  city: '',
  lat: null,
  lng: null
})

const getLocation = () => {
    gettingLocation.value = true
    locationStatus.value = 'Fetching...'
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                form.lat = position.coords.latitude
                form.lng = position.coords.longitude
                locationStatus.value = `${form.lat.toFixed(4)}, ${form.lng.toFixed(4)}`
                gettingLocation.value = false
            },
            (err) => {
                locationStatus.value = 'Failed to get location'
                gettingLocation.value = false
                alert('Could not get location. Ensure GPS is enabled.')
            }
        )
    } else {
        locationStatus.value = 'Not supported'
        gettingLocation.value = false
    }
}

const submitMasjid = async () => {
   if (!form.lat) return
   
   loading.value = true
   // Simulate API Call
   await new Promise(resolve => setTimeout(resolve, 1500))
   
   loading.value = false
   alert("Masjid submitted for verification! JazakAllah Khair.")
   router.push('/')
}
</script>
