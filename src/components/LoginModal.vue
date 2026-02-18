<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" @click="close"></div>
    
    <!-- Modal -->
    <div class="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">
            {{ step === 1 ? 'Login' : 'Verify OTP' }}
          </h2>
          <button @click="close" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Step 1: Details -->
        <form v-if="step === 1" @submit.prevent="sendOtp">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input v-model="form.name" type="text" required class="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400" placeholder="Enter your name" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
              <div class="flex">
                <span class="inline-flex items-center px-3 border border-r-0 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm rounded-l-md font-medium">
                  +91
                </span>
                <input v-model="form.mobile" type="tel" required pattern="[0-9]{10}" class="flex-1 min-w-0 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400" placeholder="00000 00000" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <textarea v-model="form.address" rows="2" class="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400" placeholder="City, Area..."></textarea>
            </div>
          </div>
          <button type="submit" class="w-full mt-6 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30">
            Get OTP
          </button>
        </form>

        <!-- Step 2: OTP -->
        <form v-else @submit.prevent="verifyOtp">
           <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
             We've sent a code to <span class="font-bold text-gray-800 dark:text-gray-200">+91 {{ form.mobile }}</span>
           </p>
           
             <div class="flex gap-2 justify-center mb-6">
                <input 
                  v-for="(n, index) in 4"
                  :key="index"
                  type="text" 
                  maxlength="1"
                  :ref="(el) => { if (el) otpInputs[index] = el }"
                  class="w-12 h-14 text-center text-xl font-bold bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 outline-none transition-all"
                  @input="e => handleOtpInput(e, index)"
                  @keydown.delete="e => handleOtpDelete(e, index)"
                />
             </div>

           <button type="submit" :disabled="isLoading" class="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2">
             <Loader2Icon v-if="isLoading" class="w-4 h-4 animate-spin" />
             Verify & Login
           </button>
           
           <button type="button" @click="step = 1" class="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
             Change Number
           </button>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { XIcon, Loader2Icon } from 'lucide-vue-next'
import { useSettingsStore } from '../stores/settings'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'login-success'])

const step = ref(1)
const isLoading = ref(false)
const otpInputs = ref([])
const form = reactive({
  name: '',
  mobile: '',
  address: ''
})
const otp = ref(['', '', '', ''])
const settingsStore = useSettingsStore()

const close = () => {
  emit('close')
  setTimeout(() => {
     step.value = 1
     otp.value = ['', '', '', '']
  }, 300)
}

const sendOtp = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  isLoading.value = false
  // For demo, we assume OTP is sent automatically.
  // In a real app, this is where you'd trigger the SMS API.
  step.value = 2
  nextTick(() => {
    if(otpInputs.value[0]) otpInputs.value[0].focus()
  })
}

const handleOtpInput = (e, index) => {
  const val = e.target.value
  if (val && index < 3) {
    otpInputs.value[index + 1].focus()
  }
  otp.value[index] = val
}

const handleOtpDelete = (e, index) => {
  if (!e.target.value && index > 0) {
    otpInputs.value[index - 1].focus()
  }
  otp.value[index] = '' 
}

const verifyOtp = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Here we would verify the OTP with the backend.
  // For this prototype, we just accept anything.
  isLoading.value = false
  
  settingsStore.login(form)
  emit('login-success', form)
  close()
}
</script>
