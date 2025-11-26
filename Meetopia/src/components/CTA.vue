<template>
  <div class="bg-muted/50 relative overflow-hidden">
    <!-- CTA Section -->
    <section class="py-24 sm:py-32 relative">
      <!-- Background grid pattern -->
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="max-w-3xl mx-auto text-center">
          <!-- Logo Icon -->
          <div class="flex justify-center mb-8">
            <img src="@/assets/logo.svg" alt="Meetopia" class="h-12 w-12" />
          </div>

          <!-- Main Heading -->
          <h2 class="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6 tracking-tight">
            Turn discussion into action.
          </h2>

          <!-- Subtext -->
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Meetopia is in active development, and we're looking for our first dedicated users.
            Be among the first to experience it and help shape its future.
          </p>

          <!-- CTA Button -->
          <RouterLink to="/register">
            <Button size="lg"
              class="px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90 transition-colors duration-150">
              Join Beta Program
              <ArrowRight class="ml-2 h-5 w-5" />
            </Button>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-vue-next'
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