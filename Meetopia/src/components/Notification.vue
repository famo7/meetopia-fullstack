<template>
  <DropdownMenu v-model:open="isOpen">
    <DropdownMenuTrigger as-child>
      <button
        class="relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        aria-label="Notifications">
        <Bell class="h-4 w-4" />
        <span v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground shadow-sm border border-background/50">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
      </button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-80 p-0" align="end" side="bottom">
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold">Notifications</h3>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center p-8">
        <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary"></div>
      </div>

      <div v-else-if="notifications.length === 0" class="p-8 text-center">
        <Bell class="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p class="mt-2 text-sm text-muted-foreground">No notifications yet</p>
      </div>

      <div v-else class="max-h-96 overflow-y-auto">
        <DropdownMenuItem v-for="notification in notifications" :key="notification.id"
          class="flex flex-col items-start p-4 cursor-pointer transition-colors hover:bg-accent/50 focus:bg-accent/50"
          :class="{ 'bg-accent/30': !notification.isRead }" @click.prevent="handleNotificationClick(notification)">
          <div class="flex w-full items-start justify-between gap-3">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full" :class="getNotificationColorClass(notification.type)"></div>
                <p class="font-medium text-sm leading-none">{{ notification.title }}</p>
              </div>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ notification.message }}</p>
              <p class="text-xs text-muted-foreground mt-1">
                {{ formatRelativeTime(notification.createdAt) }}
              </p>
            </div>
            <div class="flex-shrink-0 mt-1">
              <div v-if="!notification.isRead" class="h-2 w-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </DropdownMenuItem>
      </div>

      <div v-if="notifications.length > 0" class="p-2 border-t">
        <Button variant="ghost" class="w-full justify-center text-sm" @click="handleViewAll">
          View all notifications
        </Button>
      </div>

      <!-- Clear All Confirmation Dialog -->
      <AlertDialog v-model:open="showClearAllDialog">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All your notifications will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="handleClearAll" :disabled="isClearingAll"
              class="bg-destructive hover:bg-destructive/90">
              <Loader2 v-if="isClearingAll" class="mr-2 h-4 w-4 animate-spin" />
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bell, Loader2 } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types/notification'
import {
  getNotificationColorClass,
  formatRelativeTime,
  handleNotificationNavigation
} from '@/lib/notificationUtils'

const notificationStore = useNotificationStore()
const router = useRouter()
const isOpen = ref(false)
const showClearAllDialog = ref(false)
const isClearingAll = ref(false)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const isLoading = computed(() => notificationStore.isLoading)

onMounted(async () => {
  await notificationStore.fetchNotifications()
})


const handleNotificationClick = async (notification: Notification) => {
  if (!notification.isRead) {
    try {
      await notificationStore.markNotificationAsRead(notification.id)
    } catch (error) {

    }
  }

  handleNotificationNavigation(notification, router)
}

const handleViewAll = () => {
  isOpen.value = false
  router.push({ name: 'notifications' })
}

const handleClearAll = async () => {
  try {
    isClearingAll.value = true
    await notificationStore.removeAllNotifications()
    showClearAllDialog.value = false
    isOpen.value = false
  } finally {
    isClearingAll.value = false
  }
}
</script>