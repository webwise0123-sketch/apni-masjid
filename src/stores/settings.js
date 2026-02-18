
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
    // Auth State
    const user = ref(JSON.parse(localStorage.getItem('user')) || null)
    const isLoggedIn = computed(() => !!user.value)

    const login = (userData) => {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
    }

    const logout = () => {
        user.value = null
        localStorage.removeItem('user')
    }

    // Theme State
    const isDarkMode = ref(localStorage.getItem('darkMode') === 'true')

    // Initialize Theme
    const initTheme = () => {
        if (localStorage.getItem('darkMode') === 'true' ||
            (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            isDarkMode.value = true
            document.documentElement.classList.add('dark')
        } else {
            isDarkMode.value = false
            document.documentElement.classList.remove('dark')
        }
    }

    // Call immediately
    initTheme()

    const toggleDarkMode = () => {
        isDarkMode.value = !isDarkMode.value
        if (isDarkMode.value) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('darkMode', 'true')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('darkMode', 'false')
        }
    }

    return {
        user,
        isLoggedIn,
        login,
        logout,
        isDarkMode,
        toggleDarkMode
    }
})
