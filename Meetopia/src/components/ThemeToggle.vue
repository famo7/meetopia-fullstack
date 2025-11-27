<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Laptop2, Moon, SunMedium } from 'lucide-vue-next'

type ThemeMode = 'system' | 'light' | 'dark'

const mode = ref<ThemeMode>('system')
let mediaQuery: MediaQueryList | null = null

const applyTheme = (value: ThemeMode) => {
  localStorage.setItem('theme', value)
  const prefersDark = mediaQuery?.matches ?? false
  const isDark = value === 'dark' || (value === 'system' && prefersDark)
  document.documentElement.classList.toggle('dark', isDark)
}

const handleSystemChange = (event: MediaQueryListEvent) => {
  if (mode.value === 'system') {
    document.documentElement.classList.toggle('dark', event.matches)
  }
}

const setMode = (value: ThemeMode) => {
  mode.value = value
  applyTheme(value)
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const stored = (localStorage.getItem('theme') as ThemeMode | null) ?? 'system'
  mode.value = stored
  applyTheme(mode.value)
  mediaQuery.addEventListener('change', handleSystemChange)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', handleSystemChange)
})
</script>

<template>
  <div class="flex items-center gap-4" role="radiogroup" aria-label="Theme selection">
    <div class="flex items-center gap-2 rounded-2xl border border-border/60 bg-muted/40 p-1 shadow-sm">
      <button v-for="option in [
          { value: 'system', icon: Laptop2, label: 'System' },
          { value: 'light', icon: SunMedium, label: 'Light' },
          { value: 'dark', icon: Moon, label: 'Dark' }
        ]" :key="option.value" type="button" role="radio" :aria-checked="mode === option.value"
        @click="setMode(option.value as ThemeMode)"
        class="relative flex h-12 w-14 items-center justify-center rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :class="mode === option.value
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'">
        <component :is="option.icon" class="h-5 w-5" aria-hidden="true" />
        <span class="sr-only">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>
