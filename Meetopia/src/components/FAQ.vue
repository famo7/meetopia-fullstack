<template>
  <section class="py-16 sm:py-24 lg:py-32 bg-background">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-12 sm:mb-16">
          <Badge variant="outline"
            class="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors">
            FAQ
          </Badge>
          <h2
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight px-4 sm:px-0">
            Frequently Asked Questions
          </h2>
          <p class="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Everything you need to know about Meetopia. Can't find the answer you're looking for?
            <Button variant="link"
              class="h-auto p-0 text-base sm:text-lg text-primary hover:text-primary/80 underline-offset-4">
              Contact us
            </Button>
          </p>
        </div>

        <!-- FAQ Accordion -->
        <div class="space-y-3 sm:space-y-4">
          <div v-for="(item, index) in faqItems" :key="index">
            <Card class="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent class="p-0">
                <Button @click="toggleItem(index)" variant="ghost"
                  class="w-full p-4 sm:p-6 text-left justify-between hover:bg-muted/30 rounded-lg">
                  <span class="text-sm sm:text-base font-medium text-foreground pr-3 sm:pr-4 leading-relaxed">{{
                    item.question }}</span>
                  <ChevronDown
                    class="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 mt-0.5"
                    :class="{ 'rotate-180': openItems.has(index) }" />
                </Button>

                <div class="overflow-hidden transition-all duration-300 ease-in-out"
                  :class="openItems.has(index) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'">
                  <div class="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p class="text-sm sm:text-base text-muted-foreground leading-relaxed">{{ item.answer }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <!-- Bottom CTA -->

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown } from 'lucide-vue-next'

// FAQ data
const faqItems = [
  {
    question: "Is my meeting data secure and private?",
    answer: "Absolutely. Your notes and action items are encrypted and private by default. We never share or sell your data. You can read our detailed Privacy Policy for more information."
  },
  {
    question: "What's the difference between the Free and Pro plan?",
    answer: "The Free plan is perfect for trying Meetopia with 1 active meeting and up to 5 participants. The Pro plan unlocks unlimited meetings, 25 participants per meeting, and powerful features like assigning action items with priorities & deadlines and your personal action item dashboard."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your Pro plan at any time, instantly, right from your account settings. No hidden fees, no run-around."
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "All your data remains yours. If you cancel, you can still access and export your meeting notes and action items. We don't hold your data hostage."
  }
]

// State management for accordion
const openItems = ref(new Set<number>())

const toggleItem = (index: number) => {
  if (openItems.value.has(index)) {
    openItems.value.delete(index)
  } else {
    openItems.value.add(index)
  }
}
</script>

<style scoped>
/* Smooth accordion animation */
.transition-all {
  transition-property: max-height, opacity;
}
</style>
