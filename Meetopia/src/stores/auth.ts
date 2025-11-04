import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'

export interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // Computed
  const isAuthenticated = computed(() => user.value !== null)

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', { email, password })
      user.value = response.data.user
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/register', { name, email, password })
      user.value = response.data.user
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
      user.value = null
      isInitialized.value = false // Reset on logout
      router.push('/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  // Check if user is authenticated (validates httpOnly cookie)
  const checkAuth = async () => {
    if (isInitialized.value) return // Only check once

    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/auth/me')
      user.value = response.data.user
    } catch (err) {
      user.value = null
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    isInitialized,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  }
})
