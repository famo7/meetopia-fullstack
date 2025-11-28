<script setup lang="ts">
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
} from '@/components/ui/sidebar'
import { LayoutDashboard, Calendar, CheckCircle2, Bell, User, LogOut } from 'lucide-vue-next'
import logo from '@/assets/logo.svg'

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
  <Sidebar class="border-r border-border/40 bg-background">
    <SidebarHeader class="px-6 py-4">
      <router-link to="/dashboard" class="flex items-center gap-3">
        <img :src="logo" alt="Meetopia Logo" class="h-8 w-8" />
        <span class="text-lg font-semibold text-foreground">
          Meetopia
        </span>
      </router-link>
    </SidebarHeader>

    <SidebarContent class="px-3 py-4">
      <SidebarGroup>
        <span class="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Menu
        </span>
        <SidebarGroupContent class="space-y-1">
          <SidebarMenu>
            <SidebarMenuItem v-for="item in menuItems" :key="item.title">
              <SidebarMenuButton as-child :is-active="isActive(item.url)"
                class="h-11 rounded-lg transition-all duration-200 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent/50">
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

    <SidebarFooter class="px-3 py-4 mt-auto">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild class="h-11 rounded-lg transition-all duration-200 hover:bg-accent/50">
            <button @click="router.push('/dashboard/profile')" class="flex items-center gap-3 px-3 w-full">
              <div class="flex aspect-square size-8 items-center justify-center rounded-full bg-muted">
                <User class="size-4" />
              </div>
              <div class="grid flex-1 text-left">
                <span class="font-medium text-sm">{{ authStore.user?.name }}</span>
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