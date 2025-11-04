<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 px-4">
    <Card class="w-full max-w-md shadow-xl">
      <CardHeader class="space-y-3 text-center">
        <div class="flex justify-center mb-2">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-xl">M</span>
          </div>
        </div>
        <CardTitle class="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your Meetopia account</CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Error Message -->
        <div v-if="authStore.error" class="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p class="text-sm text-destructive">{{ authStore.error }}</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="formData.email" type="email" placeholder="john@example.com" required
              :disabled="authStore.isLoading" />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">Password</Label>
              <router-link to="/forgot-password" class="text-sm text-primary hover:underline">
                Forgot password?
              </router-link>
            </div>
            <div class="relative">
              <Input id="password" v-model="formData.password" :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••" required class="pr-10" :disabled="authStore.isLoading" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                :disabled="authStore.isLoading">
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Signing In...' : 'Sign In' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex justify-center">
        <p class="text-sm text-muted-foreground">
          Don't have an account?
          <router-link to="/register" class="text-primary hover:underline font-medium ml-1">
            Create account
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-vue-next'

const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
})

const showPassword = ref(false)

const handleLogin = async () => {
  try {
    await authStore.login(formData.value.email, formData.value.password)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>
