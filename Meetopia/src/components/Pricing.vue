<template>
  <section id="pricing" class="py-24 bg-muted/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Full width card -->
        <Card class="border-border bg-card overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <!-- Left: Content -->
            <div class="p-8 lg:p-12">
              <p class="text-sm font-medium text-primary mb-3">Beta Program</p>
              <h2 class="text-3xl font-semibold text-foreground mb-4 tracking-tight">
                Join our Beta Program
              </h2>
              <p class="text-muted-foreground mb-8 leading-relaxed">
                Be part of our exclusive beta testing community and help shape the future of Meetopia.
              </p>

              <!-- Features grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div v-for="feature in betaFeatures" :key="feature" class="flex items-center">
                  <Check class="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                  <span class="text-sm text-muted-foreground">{{ feature }}</span>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button size="lg" as-child>
                  <RouterLink to="/register">
                    Join Beta Program
                  </RouterLink>
                </Button>
                <p class="text-xs text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>

            <!-- Right: Price highlight -->
            <div class="bg-muted/30 p-8 lg:p-12 flex flex-col items-center justify-center text-center">
              <p class="text-sm text-muted-foreground mb-2">During beta period</p>
              <div class="flex items-baseline mb-4">
                <span class="text-6xl font-semibold text-foreground">Free</span>
              </div>
              <p class="text-sm text-muted-foreground max-w-xs">
                Get full access to all features while we're in beta. Help us improve and lock in early adopter benefits.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check } from 'lucide-vue-next'

const betaFeatures = [
  'Unlimited Active Meetings',
  'Real-time Collaborative Notes',
  'Create & View Action Items',
  'Assign Action Items & Set Due Dates',
  'Personal Action Item Dashboard',
  'Unlimited Participants',
  'Priority Support & Feedback Channel',
  'Early Access to New Features'
]
</script>

<style scoped></style>
