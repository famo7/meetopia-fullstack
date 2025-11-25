<template>
  <section id="pricing" class="py-24 bg-background">
    <div class="container mx-auto px-6">
      <div class="max-w-5xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <Badge variant="outline" class="mb-6 px-4 py-2 rounded-full text-sm font-medium tracking-wide bg-primary/5 text-primary border-primary/20">
            Beta Program
          </Badge>
          <h2 class="text-4xl font-bold text-foreground mb-4 tracking-tight">
            Join our Beta Program
          </h2>
          <p class="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Be part of our exclusive beta testing community and help shape the future of Meetopia.
          </p>
        </div>

        <!-- Beta Program Card -->
        <div class="max-w-2xl mx-auto">
          <Card class="relative border-2 border-primary/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300">
            <!-- Beta Badge -->
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge class="px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm">
                Beta Program
              </Badge>
            </div>

            <CardContent class="p-8 pt-12">
              <div class="text-center mb-8">
                <h3 class="text-xl font-semibold text-foreground mb-2">Beta Tester</h3>
                <p class="text-sm text-muted-foreground mb-6">For early adopters and feedback providers</p>
                <div class="flex items-baseline justify-center">
                  <span class="text-4xl font-bold text-foreground">Free</span>
                  <span class="text-sm text-muted-foreground ml-2">During Beta</span>
                </div>
              </div>

              <Button class="w-full mb-8 bg-primary hover:bg-primary/90 text-base">
                Join Beta Program
              </Button>

              <div class="mb-6">
                <p class="text-sm font-medium text-foreground mb-4">Beta Features:</p>
              </div>

              <ul class="space-y-4">
                <li v-for="feature in betaFeatures" :key="feature" class="flex items-start">
                  <Check class="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span class="text-sm text-muted-foreground">{{ feature }}</span>
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

// Beta features
const betaFeatures = [
  'Unlimited Active Meetings',
  'Real-time Collaborative Notes',
  'Create & View Action Items',
  'Assign Action Items & Set Due Dates',
  'Personal Action Item Dashboard',
  'Up to 25 Participants per Meeting',
  'Priority Support & Feedback Channel',
  'Early Access to New Features'
]
</script>

<style scoped></style>
