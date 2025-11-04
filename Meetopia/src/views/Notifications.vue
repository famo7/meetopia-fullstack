<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Notifications</h1>
        <p class="text-muted-foreground mt-2">Stay updated with your latest activities and alerts</p>
      </div>
      <div class="flex items-center gap-3">
        <Button v-if="unreadCount > 0" variant="outline" @click="handleMarkAllAsRead" :disabled="isMarkingAllAsRead"
          class="gap-2">
          <CheckCheck class="h-4 w-4" />
          Mark all as read
        </Button>
        <Button v-if="notifications.length > 0" variant="outline" @click="showClearAllDialog = true" class="gap-2">
          <Trash2 class="h-4 w-4" />
          Clear all
        </Button>
        <Button variant="ghost" size="sm" @click="notificationStore.fetchNotifications()" class="gap-2">
          <RefreshCw class="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>

    <Card class="border-0 shadow-sm">
      <CardContent class="p-4">
        <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div class="flex gap-2">
            <Button :variant="activeFilter === 'all' ? 'default' : 'ghost'" size="sm" @click="activeFilter = 'all'">
              All ({{ totalCount }})
            </Button>
            <Button :variant="activeFilter === 'unread' ? 'default' : 'ghost'" size="sm"
              @click="activeFilter = 'unread'">
              Unread ({{ unreadCount }})
            </Button>
          </div>
          <div class="text-sm text-muted-foreground">
            {{ filteredNotifications.length }} notification{{ filteredNotifications.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-if="isLoading" class="space-y-4">
      <Card v-for="i in 5" :key="i" class="border-0 shadow-sm">
        <CardContent class="p-6">
          <div class="flex items-start gap-4">
            <Skeleton class="h-10 w-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-3/4" />
              <Skeleton class="h-3 w-full" />
              <Skeleton class="h-3 w-1/2" />
            </div>
            <Skeleton class="h-6 w-16" />
          </div>
        </CardContent>
      </Card>
    </div>

    <Card v-else-if="filteredNotifications.length === 0" class="border-0 shadow-sm">
      <CardContent class="p-12 text-center">
        <Bell class="mx-auto h-16 w-16 text-muted-foreground opacity-20 mb-4" />
        <h3 class="text-lg font-semibold mb-2">No notifications</h3>
        <p class="text-muted-foreground">
          {{ activeFilter === 'unread' ? 'All caught up! No unread notifications.' : 'No notifications to show.' }}
        </p>
      </CardContent>
    </Card>

    <div v-else class="space-y-3">
      <Card v-for="notification in filteredNotifications" :key="notification.id"
        class="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
        :class="{ 'bg-primary/5 border-l-4 border-l-primary': !notification.isRead }"
        @click="handleNotificationClick(notification)">
        <CardContent class="p-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 mt-1">
              <div class="h-10 w-10 rounded-full flex items-center justify-center"
                :class="getNotificationIconBackground(notification.type)">
                <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" />
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2 mb-2">
                <h3 class="font-semibold text-foreground leading-tight">{{ notification.title }}</h3>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <Badge v-if="!notification.isRead" variant="secondary" class="text-xs">New</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child @click.stop>
                      <Button variant="ghost" size="sm" class="h-8 w-8 p-0">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem v-if="!notification.isRead"
                        @click.stop="handleMarkAsRead(notification.id.toString())">
                        <Check class="h-4 w-4 mr-2" />
                        Mark as read
                      </DropdownMenuItem>
                      <DropdownMenuItem v-else @click.stop="handleMarkAsUnread(notification.id.toString())">
                        <Mail class="h-4 w-4 mr-2" />
                        Mark as unread
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <p class="text-muted-foreground mb-3 leading-relaxed">{{ notification.message }}</p>

              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <span class="flex items-center gap-1">
                  <Clock class="h-3 w-3" />
                  {{ formatRelativeTime(notification.createdAt) }}
                </span>
                <span class="flex items-center gap-1">
                  <Tag class="h-3 w-3" />
                  {{ getNotificationTypeLabel(notification.type) }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
          <AlertDialogAction @click="handleClearAll" :disabled="isClearingAll" class="bg-destructive hover:bg-destructive/90">
            <Loader2 v-if="isClearingAll" class="mr-2 h-4 w-4 animate-spin" />
            Clear all
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@/stores/notification'
import type { Notification } from '@/types/notification'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Bell,
  CheckCheck,
  RefreshCw,
  Clock,
  Tag,
  MoreHorizontal,
  Check,
  Mail,
  Trash2,
  Loader2
} from 'lucide-vue-next'
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
import {
  getNotificationIcon,
  getNotificationIconBackground,
  getNotificationTypeLabel,
  formatRelativeTime,
  handleNotificationNavigation
} from '@/lib/notificationUtils'

const notificationStore = useNotificationStore()
const router = useRouter()
const activeFilter = ref('all')
const isMarkingAllAsRead = ref(false)
const showClearAllDialog = ref(false)
const isClearingAll = ref(false)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)
const totalCount = computed(() => notifications.value.length)
const isLoading = computed(() => notificationStore.isLoading)

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.isRead)
  }

  return filtered.sort((a, b) => {
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

onMounted(async () => {
  await notificationStore.fetchNotifications()
})

const handleMarkAllAsRead = async () => {
  try {
    isMarkingAllAsRead.value = true
    await notificationStore.markAllAsRead()
  } finally {
    isMarkingAllAsRead.value = false
  }
}

const handleMarkAsRead = async (id: string) => {
  await notificationStore.markNotificationAsRead(parseInt(id))
}

const handleMarkAsUnread = async (id: string) => {
  await notificationStore.markNotificationAsUnread(parseInt(id))
}

const handleClearAll = async () => {
  try {
    isClearingAll.value = true
    await notificationStore.removeAllNotifications()
    showClearAllDialog.value = false
  } finally {
    isClearingAll.value = false
  }
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.isRead) {
    await notificationStore.markNotificationAsRead(notification.id)
  }
  handleNotificationNavigation(notification, router)
}
</script>