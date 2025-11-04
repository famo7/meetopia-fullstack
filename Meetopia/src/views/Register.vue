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
        <CardTitle class="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join Meetopia and start organizing amazing meetings</CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Error Message -->
        <div v-if="authStore.error" class="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p class="text-sm text-destructive">{{ authStore.error }}</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Name Field -->
          <div class="space-y-2">
            <Label for="name">Full Name</Label>
            <Input id="name" v-model="formData.name" type="text" placeholder="John Doe" required
              :disabled="authStore.isLoading" />
          </div>

          <!-- Email Field -->
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="formData.email" type="email" placeholder="john@example.com" required
              :disabled="authStore.isLoading" />
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <Label for="password">Password</Label>
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

          <!-- Confirm Password Field -->
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm Password</Label>
            <div class="relative">
              <Input id="confirmPassword" v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'" placeholder="••••••••" required class="pr-10"
                :class="{ 'border-destructive': passwordMismatch }" :disabled="authStore.isLoading" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                :disabled="authStore.isLoading">
                <EyeOff v-if="showConfirmPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
            <p v-if="passwordMismatch" class="text-sm text-destructive">
              Passwords don't match
            </p>
          </div>

          <!-- Submit Button -->
          <Button type="submit" class="w-full" :disabled="passwordMismatch || authStore.isLoading">
            {{ authStore.isLoading ? 'Creating Account...' : 'Create Account' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="flex justify-center">
        <p class="text-sm text-muted-foreground">
          Already have an account?
          <router-link to="/login" class="text-primary hover:underline font-medium ml-1">
            Sign in
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordMismatch = computed(() => {
  return formData.value.confirmPassword.length > 0 &&
    formData.value.password !== formData.value.confirmPassword
})

const handleRegister = async () => {
  if (passwordMismatch.value) return

  try {
    await authStore.register(
      formData.value.name,
      formData.value.email,
      formData.value.password
    )
  } catch (error) {
    console.error('Registration failed:', error)
  }
}

onMounted(() => {
  authStore.clearError()
})
</script>
