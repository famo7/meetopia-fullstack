<template>
  <section id="features" class="py-16 sm:py-24 lg:py-32 bg-muted/30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-12 sm:mb-16">
          <p class="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase mb-3 sm:mb-4">Features</p>
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight px-4 sm:px-0">
            Meet smarter, not harder
          </h2>
          <p
            class="text-base sm:text-lg text-muted-foreground max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Turn discussion into action. End meeting fatigue with a platform designed for real results.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-0">
          <FeatureCard v-for="feature in features" :key="feature.title" :title="feature.title"
            :description="feature.description" :link-text="feature.linkText" :icon="feature.icon" />
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FeatureCard from './FeatureCard.vue'
import {
  Users,
  CheckSquare,
  Share2
} from 'lucide-vue-next'

const features = [

  {
    title: 'Collaborate in real-time',
    description: "Edit meeting notes together in real-time. See teammates' cursors and changes live, so everyone is always on the same page.",
    linkText: 'See how it works',
    icon: Users
  },
  {
    title: 'Track what matters',
    description: "Capture decisions and assign clear action items before the meeting ends. Set deadlines, assign owners, and ensure nothing gets forgotten.",
    linkText: 'Start organizing',
    icon: CheckSquare
  },
  {
    title: 'Share instantly',
    description: "Generate a simple link to invite your team. One click is all it takes for them to join the meeting and get to work.",
    linkText: 'Try sharing',
    icon: Share2
  },
]
</script>

<style scoped></style>
