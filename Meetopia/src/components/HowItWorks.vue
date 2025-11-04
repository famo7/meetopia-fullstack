<template>
  <section class="py-16 sm:py-24 lg:py-32 bg-background">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12 sm:mb-16">
          <Badge variant="outline"
            class="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide  bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">
            How It Works
          </Badge>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight px-4 sm:px-0">
            Get Started in 3 Easy Steps
          </h2>
          <p class="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Go from chaotic discussions to clear outcomes in minutes. Meetopia is designed for focus, follow-through,
            and finally, productive meetings.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <Card v-for="(step, index) in steps" :key="step.title"
            class="relative border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm"
            :class="{ 'ring-2 ring-primary/20': index === 1 }">
            <CardContent class="p-6 sm:p-8 text-left">
              <div class="mb-4 sm:mb-6">
                <div
                  class="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-xl sm:rounded-2xl">
                  <component :is="step.icon" class="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </div>

              <h3 class="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">{{ step.title }}</h3>
              <p class="text-muted-foreground leading-relaxed text-sm">{{ step.description }}</p>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Calendar,
  MessageSquare,
  CheckCircle as CheckIcon
} from 'lucide-vue-next'
import Badge from './ui/badge/Badge.vue';
import Card from './ui/card/Card.vue';
import CardContent from './ui/card/CardContent.vue';

const steps = [
  {
    title: '1. Schedule & Invite',
    description: 'Create your meeting and get a unique link. Send it to your team—that\'s the only setup needed.',
    icon: Calendar
  },
  {
    title: '2. Meet & Collaborate',
    description: 'Build your agenda and notes together in real-time. See edits live, so everyone contributes and stays perfectly aligned.',
    icon: MessageSquare
  },
  {
    title: '3. Follow Through',
    description: 'Turn decisions into assigned action items with clear deadlines. Meetopia tracks it all and sends automatic reminders, so work actually gets done.',
    icon: CheckIcon
  }
]
</script>

<style scoped>
/* Add subtle animations for better UX */
.group:hover .transition-colors {
  transition: all 0.3s ease;
}

/* Ensure proper spacing and alignment */
@media (min-width: 1024px) {
  .grid.grid-cols-3>div:nth-child(2) {
    position: relative;
    z-index: 10;
  }
}

@media (min-width: 1024px) {
  .grid.grid-cols-3>div:nth-child(2) {
    transform: scale(1.03);
  }
}
</style>
