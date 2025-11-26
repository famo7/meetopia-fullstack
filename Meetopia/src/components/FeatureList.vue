<template>
  <section id="features" class="py-24 bg-muted/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <h2 class="text-4xl font-semibold text-foreground mb-4 tracking-tight">
            Meet smarter, not harder
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Turn discussion into action. End meeting fatigue with a platform designed for real results.
          </p>
        </div>

        <!-- Bento Grid -->
        <div class="space-y-4 lg:space-y-6">
          <!-- Live Collaboration - Full width top card -->
          <Card class="overflow-hidden border-border bg-card">
            <div class="flex flex-col lg:flex-row">
              <div class="p-8 lg:p-10 flex flex-col justify-center lg:w-2/5">
                <h3 class="text-2xl font-semibold text-foreground mb-3">
                  Collaborate in <span class="text-primary">real-time</span>
                </h3>
                <p class="text-muted-foreground text-sm leading-relaxed">
                  Edit meeting notes together in real-time. See teammates' cursors and changes live, so everyone is
                  always on the same page.
                </p>
              </div>
              <div class="lg:w-3/5 bg-muted/30 p-6 flex items-center justify-center">
                <img src="/images/features/live.png" alt="Live collaboration"
                  class="w-full h-auto max-h-64 object-contain rounded-lg" />
              </div>
            </div>
          </Card>

          <!-- Three cards row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <!-- Action Items -->
            <Card class="overflow-hidden border-border bg-card">
              <div class="p-6 lg:p-8">
                <h3 class="text-xl font-semibold text-foreground mb-2">
                  Track <span class="text-primary">action items</span>
                </h3>
                <p class="text-muted-foreground text-sm leading-relaxed mb-6">
                  Capture decisions and assign action items before the meeting ends. Set deadlines and assign owners.
                </p>
              </div>
              <div class="bg-muted/30 p-4 flex items-center justify-center">
                <img src="/images/features/AI.png" alt="Action items" class="w-full h-auto max-h-40 object-contain" />
              </div>
            </Card>

            <!-- Calendar -->
            <Card class="overflow-hidden border-border bg-card">
              <div class="p-6 lg:p-8">
                <h3 class="text-xl font-semibold text-foreground mb-2">
                  Integrated <span class="text-primary">calendar</span>
                </h3>
                <p class="text-muted-foreground text-sm leading-relaxed mb-6">
                  Schedule and manage your meetings with our built-in calendar. Stay organized in one place.
                </p>
              </div>
              <div class="bg-muted/30 p-4 flex items-center justify-center">
                <img src="/images/features/calendar.png" alt="Integrated calendar"
                  class="w-full h-auto max-h-40 object-contain" />
              </div>
            </Card>

            <!-- Notifications -->
            <Card class="overflow-hidden border-border bg-card">
              <div class="p-6 lg:p-8">
                <h3 class="text-xl font-semibold text-foreground mb-2">
                  Smart <span class="text-primary">notifications</span>
                </h3>
                <p class="text-muted-foreground text-sm leading-relaxed mb-6">
                  Get timely reminders for upcoming meetings, action items, and important updates.
                </p>
              </div>
              <div class="bg-muted/30 p-4 flex items-center justify-center">
                <img src="/images/features/notification.png" alt="Smart notifications"
                  class="w-full h-auto max-h-40 object-contain" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Card } from '@/components/ui/card'
</script>

<style scoped></style>
