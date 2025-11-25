<template>
  <section class="relative bg-background overflow-hidden">
    <!-- Background gradient blobs -->
    <div aria-hidden="true" class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
      <div
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-blue-600/30 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]">
      </div>
    </div>

    <div class="relative px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-24 sm:pb-32">
      <div class="mx-auto max-w-7xl">
        <!-- Centered content layout -->
        <div class="text-center mb-16">
          <!-- Badge -->
          <div class="mb-6 sm:mb-8 flex justify-center">
            <RouterLink to="/register"
              class="relative rounded-full px-3 py-1 text-xs sm:text-sm text-muted-foreground ring-1 ring-border hover:ring-primary/50 transition-colors">
              Now in Beta • Join Early Access
              <span class="text-primary ml-2">Sign Up</span>
              <MoveRight class="inline-block ml-1 text-primary" :size="12" :stroke-width="3.3" />
            </RouterLink>
          </div>

          <!-- Main heading -->
          <h1 class="scroll-m-20 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6">
            Transform Your <span class="text-primary">Meetings</span>
            <br>
            Into Action
          </h1>

          <p
            class="mt-6 sm:mt-8 text-base sm:text-xl/8 font-medium text-pretty text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto">
            The only platform you need to collaborate in real-time, track action items, and turn every meeting into
            measurable results.
          </p>

          <!-- CTA buttons -->
          <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 mb-16">
            <Button size="lg" class="w-full sm:w-auto rounded-md px-6 py-3 text-sm font-semibold shadow-sm" as-child>
              <RouterLink to="/register">
                Get Started Free
              </RouterLink>
            </Button>

            <RouterLink to="/register" class="text-sm/6 font-semibold hover:cursor-pointer">
              Sign Up
              <MoveRight class="inline-block ml-1" :size="14" :stroke-width="3.3" />
            </RouterLink>
          </div>
        </div>

        <!-- Video showcase - centered and prominent -->
        <div class="relative max-w-5xl mx-auto">
          <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-border/50">
            <video autoplay loop muted playsinline class="w-full h-auto">
              <source src="/videos/meetopia.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <!-- Play button overlay (optional decorative element) -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Decorative elements -->
          <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div class="absolute -top-8 -right-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        </div>
      </div>
    </div>

    <!-- Bottom background gradient -->
    <div aria-hidden="true"
      class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
      <div
        style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
        class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-primary/20 to-blue-600/20 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]">
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MoveRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>