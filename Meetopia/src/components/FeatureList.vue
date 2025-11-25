<template>
  <section id="features" class="py-24 bg-background">
    <div class="container mx-auto px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <Badge variant="outline" class="mb-6 px-4 py-2 rounded-full text-sm font-medium tracking-wide bg-primary/5 text-primary border-primary/20">
            Features
          </Badge>
          <h2 class="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Meet smarter, not harder
          </h2>
          <p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Turn discussion into action. End meeting fatigue with a platform designed for real results.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard v-for="feature in features" :key="feature.title" :title="feature.title"
            :description="feature.description" :link-text="feature.linkText" :icon="feature.icon" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FeatureCard from './FeatureCard.vue'
import { Badge } from '@/components/ui/badge'
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
