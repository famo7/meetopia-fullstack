<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = systemPrefersDark
  }

  document.documentElement.classList.toggle('dark', isDark.value)
})

watch(isDark, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark', newValue)
})

const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>

<template>
  <div class="flex items-center gap-3">
    <span class="text-sm font-medium text-foreground">Theme</span>
    <button @click="toggleTheme"
      class="relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      :class="isDark ? 'bg-slate-700' : 'bg-slate-200'" role="switch" :aria-checked="isDark" aria-label="Toggle theme">
      <div class="absolute inset-0 rounded-full transition-opacity duration-300"
        :class="isDark ? 'bg-gradient-to-r from-slate-600 to-slate-800' : 'bg-gradient-to-r from-amber-100 to-orange-100'">
      </div>

      <div
        class="relative z-10 h-7 w-7 rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out transform flex items-center justify-center"
        :class="isDark ? 'translate-x-8' : 'translate-x-1'">
        <svg v-if="!isDark" class="h-4 w-4 text-amber-500 transition-all duration-300" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>

        <svg v-else class="h-4 w-4 text-slate-700 transition-all duration-300" fill="none" stroke="currentColor"
          viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </div>

      <!-- Subtle indicator dots -->
      <div class="absolute left-2 h-1.5 w-1.5 rounded-full transition-opacity duration-300"
        :class="isDark ? 'bg-slate-400 opacity-30' : 'bg-amber-400 opacity-60'"></div>
      <div class="absolute right-2 h-1.5 w-1.5 rounded-full transition-opacity duration-300"
        :class="isDark ? 'bg-slate-400 opacity-60' : 'bg-amber-400 opacity-30'"></div>
    </button>
  </div>
</template>