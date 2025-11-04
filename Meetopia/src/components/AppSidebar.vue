<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { LayoutDashboard, Calendar, CheckCircle2, Bell, User, LogOut, Home, Settings } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Meetings',
    url: '/dashboard/meetings',
    icon: Calendar,
  },
  {
    title: 'Action Items',
    url: '/dashboard/action-items',
    icon: CheckCircle2,
  },
  {
    title: 'Notifications',
    url: '/dashboard/notifications',
    icon: Bell,
  },
]

const isActive = (url: string) => {
  if (url === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(url)
}

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <Sidebar variant="floating" class="border-r border-sidebar-border/50 bg-background/95 backdrop-blur-sm">
    <SidebarHeader class="pb-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" as-child class="data-[active=true]:bg-transparent hover:bg-transparent">
            <router-link to="/dashboard" class="flex items-center gap-3 px-2 py-3">
              <div
                class="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                <span class="font-bold text-lg">M</span>
              </div>
              <div class="grid flex-1 text-left">
                <span class="truncate font-bold text-lg tracking-tight">Meetopia</span>
                <span class="truncate text-xs text-muted-foreground">Meeting Management</span>
              </div>
            </router-link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarSeparator class="mx-2" />

    <SidebarContent class="px-3 py-4">
      <SidebarGroup>
        <SidebarGroupContent class="space-y-1">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton as-child :is-active="isActive(item.url)" size="lg"
                class="h-12 rounded-xl transition-all duration-200 data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:shadow-sm hover:bg-sidebar-accent/50">
                <router-link :to="item.url" class="flex items-center gap-3 px-3">
                  <component :is="item.icon" class="size-5" />
                  <span class="font-medium">{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarSeparator class="mx-2" />

    <SidebarFooter class="px-3 py-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg"
            class="h-12 rounded-xl transition-all duration-200 hover:bg-sidebar-accent/50">
            <button @click="router.push('/dashboard/profile')" class="flex items-center gap-3 px-3 w-full">
              <div class="flex aspect-square size-8 items-center justify-center rounded-xl bg-muted">
                <User class="size-4" />
              </div>
              <div class="grid flex-1 text-left">
                <span class="font-medium">{{ authStore.user?.name }}</span>
                <span class="text-xs text-muted-foreground">Profile</span>
              </div>
            </button>
          </SidebarMenuButton>
          <SidebarMenuAction @click="handleLogout"
            class="h-8 w-8 rounded-lg transition-all duration-200 hover:bg-destructive/10 hover:text-destructive">
            <LogOut class="size-4" />
          </SidebarMenuAction>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>