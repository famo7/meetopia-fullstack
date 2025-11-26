<template>
  <section class="py-24 bg-background">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-20">
          <h2 class="text-4xl font-semibold text-foreground mb-4 tracking-tight">
            Get started in <span class="text-primary">3 easy steps</span>
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Go from chaotic discussions to clear outcomes in minutes.
          </p>
        </div>

        <!-- Steps -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <div v-for="(step, index) in steps" :key="step.title" class="relative">
            <!-- Step card -->
            <div class="text-left">
              <!-- Number badge -->
              <div class="mb-6">
                <span
                  class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {{ index + 1 }}
                </span>
              </div>

              <!-- Content -->
              <h3 class="text-xl font-semibold text-foreground mb-3">{{ step.title }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ step.description }}</p>
            </div>

            <!-- Arrow connector (hidden on mobile and last item) -->
            <div v-if="index < steps.length - 1" class="hidden md:block absolute top-5 -right-6 lg:-right-8"
              aria-hidden="true">
              <svg class="w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Schedule & Invite',
    description: 'Create a meeting and invite your team directly. Set the date, time, and agenda—you\'re ready to go.'
  },
  {
    title: 'Meet & Collaborate',
    description: 'Build your agenda and notes together in real-time. See edits live, so everyone stays aligned.'
  },
  {
    title: 'Follow Through',
    description: 'Turn decisions into assigned action items with clear deadlines. Automatic reminders ensure work gets done.'
  }
]
</script>

<style scoped></style>
