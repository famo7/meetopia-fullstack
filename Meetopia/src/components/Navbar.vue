<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <nav class="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16" aria-label="Global">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <span class="sr-only">Meetopia</span>
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">M</span>
          </div>
          <span class="text-xl sm:text-2xl font-bold text-primary">Meetopia</span>
        </router-link>
      </div>

      <!-- Mobile menu button -->
      <div class="flex lg:hidden">
        <Sheet v-model:open="isSheetOpen">
          <SheetTrigger as-child>
            <Button variant="ghost"
              class=" h-12 w-12 sm:h-10 sm:w-10 p-0 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
              <span class="sr-only">Open main menu</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"
                class="h-6 w-6 sm:h-5 sm:w-5">
                <path d="M3 12h18M3 6h18M3 18h18" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right"
            class="w-[85vw] max-w-[320px] sm:max-w-[400px] bg-background border-l border-border/20 p-0 h-screen max-h-screen overflow-hidden flex flex-col">
            <!-- Header with Logo -->
            <div class="flex items-center justify-between p-4 border-b border-border/20 flex-shrink-0">
              <router-link to="/" class="flex items-center space-x-2" @click="isSheetOpen = false">
                <div class="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <span class="text-primary-foreground font-bold text-xs">M</span>
                </div>
                <span class="text-base font-bold text-primary">Meetopia</span>
              </router-link>
            </div>

            <!-- Navigation Links -->
            <nav class="flex flex-col p-4 space-y-2 flex-1 overflow-y-auto">
              <button @click="scrollToSectionMobile('features')"
                class="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-left w-full justify-start cursor-pointer">
                Features
              </button>
              <button @click="scrollToSectionMobile('pricing')"
                class="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-left w-full justify-start cursor-pointer">
                Pricing
              </button>
              <button @click="scrollToSectionMobile('about')"
                class="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors text-left w-full justify-start cursor-pointer">
                About
              </button>
            </nav>

            <!-- Sign In Button -->
            <div class="p-4 border-t border-border/20 flex-shrink-0">
              <Button @click="navigateToRegister"
                class="w-full h-11 text-base font-medium bg-primary hover:bg-primary/90 rounded-lg">
                Sign In
                <MoveRight class="ml-2 h-4 w-4" />
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:items-center lg:gap-x-8">
        <button @click="scrollToSection('features')"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50 cursor-pointer">
          Features
        </button>
        <button @click="scrollToSection('pricing')"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50 cursor-pointer">
          Pricing
        </button>
        <button @click="scrollToSection('about')"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-accent/50 cursor-pointer">
          About
        </button>
      </div>

      <!-- Desktop Sign In -->
      <div class="hidden lg:flex">
        <Button @click="navigateToRegister" variant="ghost" size="sm" class="text-sm font-medium">
          Sign In
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
import { MoveRight } from 'lucide-vue-next';

const router = useRouter()

// Sheet state
const isSheetOpen = ref(false)

// Navigate to register
const navigateToRegister = () => {
  isSheetOpen.value = false
  router.push('/register')
}

// Smooth scroll to section function
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerOffset = 80; // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Mobile scroll function that closes the sheet
const scrollToSectionMobile = (sectionId: string) => {
  // Close the mobile sheet first
  isSheetOpen.value = false

  // Wait a bit for the sheet to close, then scroll
  setTimeout(() => {
    scrollToSection(sectionId)
  }, 300)
}
</script>
<style scoped></style>