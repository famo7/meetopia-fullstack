<template>
  <section class="bg-background py-16 sm:py-24 lg:py-32">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Text content -->
      <div class="mx-auto max-w-3xl text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground">
          Transform Your <span class="text-primary">Meetings</span>
          <br class="hidden sm:block" />
          Into Action
        </h1>

        <p class="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          The only platform you need to collaborate in real-time, track action items, and turn every meeting into
          measurable results.
        </p>

        <!-- CTA buttons -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" class="min-w-[160px] rounded-lg" as-child>
            <RouterLink to="/register">
              Get started for free
            </RouterLink>
          </Button>

          <Button variant="outline" size="lg" class="min-w-[140px] rounded-lg" as-child>
            <RouterLink to="/demo">
              Get a demo
            </RouterLink>
          </Button>
        </div>
      </div>

      <!-- Video showcase -->
      <div class="mt-16 sm:mt-20 lg:mt-24">
        <div class="mx-auto max-w-5xl">
          <div class="relative rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <!-- Video -->
            <video ref="videoRef" :muted="true" loop playsinline class="w-full h-auto block" @click="togglePlay">
              <source src="/videos/meetopia.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            <!-- Play button overlay -->
            <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0"
              enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200"
              leave-from-class="opacity-100" leave-to-class="opacity-0">
              <div v-if="!isPlaying" class="absolute inset-0 flex items-center justify-center bg-foreground/5">
                <button
                  class="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md hover:bg-primary/90 active:scale-95 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Play video" @click="togglePlay">
                  <Play class="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

function togglePlay() {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}
</script>

<style scoped></style>