<template>
  <section class="py-24 bg-background">
    <div class="container mx-auto px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <Badge variant="outline" class="mb-6 px-4 py-2 rounded-full text-sm font-medium tracking-wide bg-primary/5 text-primary border-primary/20">
            How It Works
          </Badge>
          <h2 class="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Get Started in 3 Easy Steps
          </h2>
          <p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Go from chaotic discussions to clear outcomes in minutes. Meetopia is designed for focus, follow-through, and finally, productive meetings.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card v-for="(step, index) in steps" :key="step.title" 
            class="relative border border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            :class="{ 'ring-2 ring-primary/20 border-primary/30': index === 1 }">
            <CardContent class="p-8 text-center">
              <div class="mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <component :is="step.icon" class="w-8 h-8 text-primary" />
                </div>
                <div class="inline-flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold mb-4">
                  {{ index + 1 }}
                </div>
              </div>

              <h3 class="text-xl font-semibold text-foreground mb-3">{{ step.title }}</h3>
              <p class="text-muted-foreground leading-relaxed">{{ step.description }}</p>
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
    title: 'Schedule & Invite',
    description: 'Create your meeting and get a unique link. Send it to your team—that\'s the only setup needed.',
    icon: Calendar
  },
  {
    title: 'Meet & Collaborate',
    description: 'Build your agenda and notes together in real-time. See edits live, so everyone contributes and stays perfectly aligned.',
    icon: MessageSquare
  },
  {
    title: 'Follow Through',
    description: 'Turn decisions into assigned action items with clear deadlines. Meetopia tracks it all and sends automatic reminders, so work actually gets done.',
    icon: CheckIcon
  }
]
</script>

<style scoped></style>
