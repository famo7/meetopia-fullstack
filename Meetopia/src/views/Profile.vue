<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">Profile</h1>
      <p class="text-muted-foreground mb-8">Manage your account settings and preferences</p>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User class="h-10 w-10 text-primary" />
            </div>
            <div>
              <p class="text-xl font-semibold">{{ authStore.user?.name || 'User' }}</p>
              <p class="text-muted-foreground">{{ authStore.user?.email || 'email@example.com' }}</p>
            </div>
          </div>

          <div class="pt-4 border-t">
            <p class="text-sm text-muted-foreground">
              This is a placeholder profile page. More features coming soon!
            </p>
          </div>
        </CardContent>
      </Card>

      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize your theme preference</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm font-medium text-foreground">Theme</p>
              <p class="text-xs text-muted-foreground">Choose between light and dark mode</p>
            </div>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from 'lucide-vue-next'
import ThemeToggle from '@/components/ThemeToggle.vue'

const authStore = useAuthStore()
</script>