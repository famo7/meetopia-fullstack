<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from './components/Navbar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showNavbar = computed(() => !route.path.startsWith('/dashboard'))
const isCheckingAuth = ref(true)

onMounted(async () => {
  await authStore.checkAuth()

  // Only redirect if on guest pages and authenticated
  if (authStore.isAuthenticated && (route.path === '/' || route.path === '/login' || route.path === '/register')) {
    router.push('/dashboard')
  }
  isCheckingAuth.value = false
})
</script>

<template>
  <div>
    <!-- Show loading while checking auth to prevent flicker -->
    <div v-if="isCheckingAuth" class="flex items-center justify-center h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center animate-pulse">
          <span class="text-primary-foreground font-bold text-xl">M</span>
        </div>
        <p class="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>

    <!-- Show app content after auth check -->
    <div v-else>
      <Navbar v-if="showNavbar" />
      <RouterView />
    </div>
  </div>
</template>