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
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400" placeholder="you@example.com" />
            </div>
          </div>
          <button type="submit" class="w-full mt-6 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30">
            Get OTP
          </button>
        </form>

        <!-- Step 2: OTP (8 digits to match Supabase) -->
        <form v-else @submit.prevent="verifyOtp">
           <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
             We've sent an 8-digit code to <span class="font-bold text-gray-800 dark:text-gray-200">{{ form.email }}</span>
           </p>
           
              <div class="flex gap-1.5 justify-center mb-6">
                 <input 
                   v-for="(n, index) in 8"
                   :key="index"
                   type="text" 
                   maxlength="1"
                   inputmode="numeric"
                   :ref="(el) => { if (el) otpInputs[index] = el }"
                   class="w-9 h-11 text-center text-base font-bold bg-gray-50 dark:bg-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-900 outline-none transition-all"
                   @input="e => handleOtpInput(e, index)"
                   @keydown.delete="e => handleOtpDelete(e, index)"
                   @paste="handleOtpPaste"
                 />
              </div>

           <button type="submit" :disabled="isLoading" class="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2">
             <Loader2Icon v-if="isLoading" class="w-4 h-4 animate-spin" />
             Verify & Login
           </button>
           
           <button type="button" @click="step = 1" class="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
             Change Email
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
import { supabase } from '../supabase'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'login-success'])

const step = ref(1)
const isLoading = ref(false)
const otpInputs = ref([])
const form = reactive({
  name: '',
  email: ''
})
const otp = ref(['', '', '', '', '', '', '', ''])
const settingsStore = useSettingsStore()

const close = () => {
  emit('close')
  setTimeout(() => {
     step.value = 1
     otp.value = ['', '', '', '', '', '', '', '']
  }, 300)
}

const sendOtp = async () => {
  if (!form.email || !form.name) return
  
  isLoading.value = true
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: form.email,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: form.name
        }
      }
    })
    
    if (error) throw error
    
    step.value = 2
    nextTick(() => {
      if(otpInputs.value[0]) otpInputs.value[0].focus()
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    alert("Failed to send OTP: " + error.message)
  } finally {
    isLoading.value = false
  }
}

const handleOtpInput = (e, index) => {
  const val = e.target.value
  if (val && index < 7) {
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

const handleOtpPaste = (e) => {
  e.preventDefault()
  const pastedData = e.clipboardData.getData('text').trim()
  if (pastedData.length <= 8) {
    for (let i = 0; i < pastedData.length && i < 8; i++) {
      otp.value[i] = pastedData[i]
      if (otpInputs.value[i]) otpInputs.value[i].value = pastedData[i]
    }
    const focusIndex = Math.min(pastedData.length, 7)
    if (otpInputs.value[focusIndex]) otpInputs.value[focusIndex].focus()
  }
}

const verifyOtp = async () => {
  isLoading.value = true
  const token = otp.value.join('')
  
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: form.email,
      token: token,
      type: 'email'
    })
    
    if (error) throw error
    
    const userProfile = {
       id: data.user.id,
       name: form.name,
       email: form.email
    }
    
    settingsStore.login(userProfile)
    emit('login-success', userProfile)
    close()
  } catch (error) {
    console.error("Error verifying OTP:", error)
    alert("Invalid OTP or expired. Please try again.")
    otp.value = ['', '', '', '', '', '', '', ''] 
    // Clear visual inputs too
    otpInputs.value.forEach(input => { if (input) input.value = '' })
  } finally {
    isLoading.value = false
  }
}
</script>
