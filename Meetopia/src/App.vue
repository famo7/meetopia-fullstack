<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from './components/Navbar.vue'
import logo from '@/assets/logo.svg'

const route = useRoute()
const authStore = useAuthStore()

const showNavbar = computed(() => !route.path.startsWith('/dashboard'))
const isCheckingAuth = ref(true)

onMounted(async () => {
  await authStore.checkAuth()
  isCheckingAuth.value = false
})
</script>

<template>
  <div>
    <div v-if="isCheckingAuth" class="flex items-center justify-center h-screen">
      <div class="flex flex-col items-center gap-4">
        <img :src="logo" alt="Meetopia Logo" class="h-12 w-auto animate-pulse" />
        <p class="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>

    <div v-else>
      <Navbar v-if="showNavbar" />
      <RouterView />
    </div>
  </div>
</template>