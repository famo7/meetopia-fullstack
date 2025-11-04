<template>
  <section class="py-24 sm:py-32 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Main CTA Content -->
        <div class="mb-12">
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 tracking-tight">
            Turn discussion into action.
          </h2>
          <p class="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Meetopia is in active development, and we're looking for our first dedicated users.
            <span class="font-semibold text-foreground">Be among the first to experience it and help shape its
              future.</span>
          </p>
        </div>

        <!-- CTA Buttons -->
        <div class="flex justify-center items-center mb-12">
          <Button size="lg"
            class="px-8 py-4 text-base font-semibold bg-primary hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Get Started for Free
            <ArrowRight class="ml-2 h-5 w-5" />
          </Button>
        </div>

        <!-- Trust Indicators -->
        <div class="flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div class="flex items-center justify-center gap-3">
            <div class="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full dark:bg-green-900/20">
              <Check class="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <span>Free to start</span>
          </div>
          <div class="flex items-center justify-center gap-3">
            <div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <Clock class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Ready in minutes</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Check,
  Clock
} from 'lucide-vue-next'
</script>

<style scoped>
/* Grid pattern background */
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
    linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px);
  background-size: 4rem 4rem;
}
</style>