<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <nav class="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16" aria-label="Global">
      <!-- Logo -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center gap-3 transition duration-200 hover:opacity-85">
          <img :src="logo" alt="Meetopia Logo" class="h-8 w-8" />
          <span class="text-lg font-semibold text-foreground">
            Meetopia
          </span>
        </router-link>
      </div>

      <!-- Mobile Menu -->
      <div class="flex lg:hidden">
        <Sheet v-model:open="isSheetOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon" class="h-10 w-10">
              <span class="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"
                class="h-5 w-5">
                <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" class="w-[300px] bg-background border-l border-border/20 p-0">
            <!-- Header with Logo -->
            <div class="flex items-center justify-center p-6 border-b border-border/20">
              <router-link to="/" @click="isSheetOpen = false" class="flex items-center gap-3">
                <img :src="logo" alt="Meetopia Logo" class="h-8 w-8" />
                <span class="text-lg font-semibold text-foreground">
                  Meetopia
                </span>
              </router-link>
            </div>

            <!-- Navigation Links -->
            <nav class="flex flex-col p-6 space-y-1">
              <button @click="scrollToSectionMobile('features')"
                class="flex items-center px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left w-full justify-start">
                Features
              </button>
              <button @click="scrollToSectionMobile('pricing')"
                class="flex items-center px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left w-full justify-start">
                Beta
              </button>
              <button @click="scrollToSectionMobile('about')"
                class="flex items-center px-4 py-3 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors text-left w-full justify-start">
                About
              </button>
            </nav>

            <!-- Sign In Button -->
            <div class="p-6 border-t border-border/20">
              <Button @click="navigateToRegister" class="w-full h-10 text-sm font-medium">
                Sign Up
                <MoveRight class="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:gap-x-8">
        <button @click="scrollToSection('features')"
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
          Features
        </button>
        <button @click="scrollToSection('pricing')"
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
          Beta
        </button>
        <button @click="scrollToSection('about')"
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50">
          About
        </button>
      </div>

      <!-- Desktop Sign In -->
      <div class="hidden lg:flex">
        <Button @click="navigateToRegister" variant="ghost" size="sm" class="text-sm font-medium">
          Sign Up
          <MoveRight class="ml-2 h-4 w-4" />
        </Button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { MoveRight } from 'lucide-vue-next'
import logo from '../assets/logo.svg'

const router = useRouter()

// Sheet state
const isSheetOpen = ref(false)

// Navigate to login
const navigateToRegister = () => {
  isSheetOpen.value = false
  router.push('/register')
}

const scrollToSection = (sectionId: string) => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 300)
    })
  } else {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

const scrollToSectionMobile = (sectionId: string) => {
  isSheetOpen.value = false

  setTimeout(() => {
    scrollToSection(sectionId)
  }, 300)
}
</script>
<style scoped></style>
