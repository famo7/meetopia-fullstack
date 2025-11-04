<template>
  <div
    class="group cursor-pointer p-4 sm:p-6 bg-background/50 rounded-lg hover:bg-background/80 transition-all duration-300 border border-border/20 hover:border-border/40">
    <div class="flex items-start gap-3 sm:gap-4">
      <div class="flex-shrink-0">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <component :is="icon" class="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-base sm:text-lg font-semibold text-foreground mb-2 leading-tight">{{ title }}</h3>
        <p class="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
          {{ description }}
        </p>
        <div
          class="flex items-center text-primary text-xs sm:text-sm font-semibold group-hover:text-primary/80 transition-colors">
          <span>{{ linkText }}</span>
          <MoveRight :size="12" :stroke-width="2"
            class="ml-2 transition-transform group-hover:translate-x-1 sm:w-3.5 sm:h-3.5" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MoveRight } from 'lucide-vue-next'

interface Props {
  title: string
  description: string
  linkText?: string
  icon: any
}

withDefaults(defineProps<Props>(), {
  linkText: 'Learn more'
})
</script>

<style scoped></style>
