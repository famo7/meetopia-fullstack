<template>
  <footer class="bg-muted/30 border-t border-border/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        <div class="lg:col-span-1">
          <div class="flex items-center mb-4 space-x-2">
            <img :src="logo" alt="Meetopia Logo" class="h-8 w-auto" />
          </div>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Better meetings, fewer headaches. Turn discussion into action.
          </p>
        </div>

        <!-- Links -->
        <div class="lg:col-span-2">
          <div class="grid grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 class="text-sm font-semibold text-foreground mb-4">Product</h3>
              <ul class="space-y-3">
                <li>
                  <Button variant="link"
                    class="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start">
                    Features
                  </Button>
                </li>
                <li>
                  <Button variant="link"
                    class="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start">
                    Pricing
                  </Button>
                </li>
                <li>
                  <Button variant="link"
                    class="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start">
                    How it works
                  </Button>
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-foreground mb-4">Company</h3>
              <ul class="space-y-3">
                <li>
                  <Button variant="link"
                    class="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start">
                    About
                  </Button>
                </li>
                <li>
                  <Button variant="link"
                    class="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start">
                    Blog
                  </Button>
                </li>
                <li>
                  <Button variant="link"
                    class="h-auto p-0 text-sm text-muted-foreground hover:text-foreground justify-start">
                    Contact
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Legal & Social -->
        <div class="lg:col-span-1">
          <h3 class="text-sm font-semibold text-foreground mb-4">Legal</h3>
          <ul class="space-y-3 mb-6">
            <li>
              <RouterLink to="/terms"
                class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                Terms of Service
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/privacy-policy"
                class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                Privacy Policy
              </RouterLink>
            </li>
          </ul>
          <div class="flex space-x-3">
            <Button variant="ghost" size="sm"
              class="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent" aria-label="Twitter">
              <Twitter class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm"
              class="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent" aria-label="GitHub">
              <Github class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm"
              class="h-9 w-9 p-0 text-muted-foreground hover:text-foreground hover:bg-accent" aria-label="LinkedIn">
              <Linkedin class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-sm text-muted-foreground">© {{ new Date().getFullYear() }} Meetopia. All rights reserved.</p>
        <nav class="flex items-center gap-6">
          <RouterLink to="/privacy-policy"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            Privacy Policy
          </RouterLink>
          <RouterLink to="/terms"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            Terms of Service
          </RouterLink>
          <button type="button"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
            @click="openCookieSettings">
            Cookie Settings
          </button>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Twitter, Github, Linkedin } from 'lucide-vue-next'
import logo from '@/assets/logo.svg'

const openCookieSettings = () => {
  // Emit event or open cookie consent modal
  // Integration point for cookie consent manager (e.g., OneTrust, Cookiebot, or custom)
  window.dispatchEvent(new CustomEvent('open-cookie-settings'))
}
</script>
