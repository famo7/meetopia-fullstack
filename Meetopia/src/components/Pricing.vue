<template>
  <section id="pricing" class="py-16 sm:py-24 lg:py-32 bg-muted/30">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-12 sm:mb-16">
          <Badge variant="outline"
            class="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">
            Pricing
          </Badge>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight px-4 sm:px-0">
            Simple, honest pricing.
          </h2>
          <p class="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Start for free. Upgrade to unlock unlimited meetings and powerful action tracking for your team.

          </p>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
          <!-- Free Plan -->
          <Card class="relative border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent class="p-6 sm:p-8">
              <div class="text-center mb-6 sm:mb-8">
                <h3 class="text-lg sm:text-xl font-bold text-foreground mb-2">Free Plan</h3>
                <p class="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">For trying out Meetopia</p>
                <div class="flex items-baseline justify-center">
                  <span class="text-3xl sm:text-4xl font-bold text-foreground">$0</span>
                  <span class="text-xs sm:text-sm text-muted-foreground ml-2">/ Forever</span>
                </div>
              </div>

              <Button variant="outline" class="w-full mb-6 sm:mb-8 text-sm sm:text-base">
                Get Started for Free
              </Button>

              <div class="mb-4 sm:mb-6">
                <p class="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4">Includes:</p>
              </div>

              <ul class="space-y-3 sm:space-y-4">
                <li v-for="feature in freeFeatures" :key="feature" class="flex items-start">
                  <Check class="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span class="text-xs sm:text-sm text-muted-foreground">{{ feature }}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Pro Plan (Most Popular) -->
          <Card
            class="relative border-2 border-primary shadow-lg hover:shadow-xl transition-all duration-300 scale-105">
            <!-- Most Popular Badge -->
            <div class="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
              <Badge
                class="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground font-semibold text-xs sm:text-sm">
                Most Popular
              </Badge>
            </div>

            <CardContent class="p-6 sm:p-8 pt-10 sm:pt-12">
              <div class="text-center mb-6 sm:mb-8">
                <h3 class="text-lg sm:text-xl font-bold text-foreground mb-2">Pro Plan</h3>
                <p class="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">For teams that rely on Meetopia</p>
                <div class="flex items-baseline justify-center mb-2">
                  <span class="text-3xl sm:text-4xl font-bold text-foreground">$8</span>
                  <span class="text-xs sm:text-sm text-muted-foreground ml-1">/user per month</span>
                </div>
                <p class="text-xs text-muted-foreground">Billed monthly. No hidden fees.</p>

              </div>

              <Button class="w-full mb-6 sm:mb-8 bg-primary hover:bg-primary/90 text-sm sm:text-base">
                Start Your Free Trial
              </Button>


              <div class="mb-4 sm:mb-6">
                <p class="text-xs sm:text-sm font-medium text-foreground mb-3 sm:mb-4">Includes everything in Free,
                  plus:</p>
              </div>

              <ul class="space-y-3 sm:space-y-4">
                <li v-for="feature in proFeatures" :key="feature" class="flex items-start">
                  <Check class="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <span class="text-xs sm:text-sm text-muted-foreground"
                    :class="feature.includes('Assign Action Items') ? 'font-medium text-foreground' : ''">{{ feature
                    }}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Check
} from 'lucide-vue-next'

// Feature lists for each plan
const freeFeatures = [
  '1 Concurrent Active Meeting',
  'Real-time Collaborative Notes',
  'Create & View Action Items',
  'Up to 5 Participants',
]

const proFeatures = [
  'Unlimited Active Meetings',
  'Up to 25 Participants per Meeting',
  'Assign Action Items & Set Due Dates',
  'Personal Action Item Dashboard'
]
</script>

<style scoped>
.scale-105 {
  transform: scale(1.05);
}

@media (max-width: 1024px) {
  .scale-105 {
    transform: none;
  }
}
</style>
