<template>
  <Card class="border-border shadow-sm">
    <CardHeader class="pb-4 border-b border-border">
      <div class="flex items-center justify-between">
        <CardTitle class="text-base font-semibold text-foreground">
          Action Items ({{ actionItems.length }})
        </CardTitle>
        <button @click="loadActionItems" class="p-1.5 hover:bg-accent rounded-lg transition-colors"
          title="Refresh action items">
          <RefreshCw class="h-4 w-4 text-muted-foreground" :class="{ 'animate-spin': actionItemStore.isLoading }" />
        </button>
      </div>
    </CardHeader>
    <CardContent class="p-6">
      <!-- Loading -->
      <div v-if="actionItemStore.isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="actionItemStore.error" class="text-center py-8">
        <p class="text-destructive mb-3">{{ actionItemStore.error }}</p>
        <button @click="loadActionItems" class="text-sm text-primary hover:text-primary/80">
          Try again
        </button>
      </div>

      <!-- Action Items List -->
      <div v-else-if="actionItems.length > 0" class="space-y-2">
        <div v-for="item in actionItems" :key="item.id"
          class="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <!-- Status Toggle (clickable if assigned to me) -->
          <button v-if="item.assignedTo.id === authStore.user?.id" @click="toggleStatus(item)"
            class="flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
            :title="`Click to ${getNextStatusAction(item.status)} (${item.status} → ${getNextStatus(item.status)})`">
            <div v-if="item.status === 'DONE'"
              class="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check class="h-3 w-3 text-white" />
            </div>
            <div v-else-if="item.status === 'IN_PROGRESS'"
              class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Clock class="h-3 w-3 text-white" />
            </div>
            <div v-else class="h-5 w-5 rounded-full border-2 border-muted-foreground hover:border-primary"></div>
          </button>

          <!-- Status Indicator (non-clickable) -->
          <div v-else class="flex-shrink-0">
            <div v-if="item.status === 'DONE'"
              class="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <Check class="h-3 w-3 text-white" />
            </div>
            <div v-else-if="item.status === 'IN_PROGRESS'"
              class="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
              <Clock class="h-3 w-3 text-white" />
            </div>
            <div v-else class="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
          </div>

          <!-- Task Details -->
          <div class="flex-1 min-w-0">
            <p :class="[
              'text-sm font-medium',
              item.status === 'DONE' ? 'line-through text-muted-foreground' : 'text-foreground'
            ]">
              {{ item.title }}
            </p>
            <div class="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span>{{ item.assignedTo.name }}</span>
              <span v-if="item.dueDate">Due: {{ formatDueDate(item.dueDate) }}</span>
            </div>
          </div>

          <!-- Priority Badge -->
          <Badge v-if="item.priority" :variant="item.priority === 'HIGH' ? 'destructive' :
            item.priority === 'MEDIUM' ? 'default' : 'secondary'
            " class="text-xs">
            {{ item.priority }}
          </Badge>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <p class="text-sm text-muted-foreground">No action items yet</p>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useActionItemStore } from '@/stores/actionItem'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Clock, RefreshCw } from 'lucide-vue-next'
import type { ActionItem } from '@/types/actionItem'

interface Props {
  meetingId: number
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const actionItemStore = useActionItemStore()

const actionItems = computed(() => actionItemStore.actionItems)

const loadActionItems = async () => {
  try {
    await actionItemStore.fetchActionItems(props.meetingId)
  } catch (error) {
    console.error('Failed to load action items:', error)
  }
}

onMounted(() => {
  loadActionItems()
})

const formatDueDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getNextStatus = (currentStatus: 'OPEN' | 'IN_PROGRESS' | 'DONE') => {
  const statusCycle: Record<string, 'OPEN' | 'IN_PROGRESS' | 'DONE'> = {
    'OPEN': 'IN_PROGRESS',
    'IN_PROGRESS': 'DONE',
    'DONE': 'OPEN'
  }
  return statusCycle[currentStatus]
}

const getNextStatusAction = (currentStatus: 'OPEN' | 'IN_PROGRESS' | 'DONE') => {
  switch (currentStatus) {
    case 'OPEN':
      return 'Start'
    case 'IN_PROGRESS':
      return 'Complete'
    case 'DONE':
      return 'Reopen'
    default:
      return 'Update'
  }
}

const toggleStatus = async (item: ActionItem) => {
  // Only allow toggle if assigned to current user
  if (item.assignedTo.id !== authStore.user?.id) {
    console.warn('User not authorized to toggle this action item')
    return
  }

  const statusCycle: Record<string, 'OPEN' | 'IN_PROGRESS' | 'DONE'> = {
    'OPEN': 'IN_PROGRESS',
    'IN_PROGRESS': 'DONE',
    'DONE': 'OPEN'
  }

  const newStatus = statusCycle[item.status]

  try {
    await actionItemStore.updateActionItem(props.meetingId, item.id, {
      status: newStatus
    })
  } catch (error: any) {
    console.error('Failed to update status:', error)

    // Show user-friendly error message
    if (error.response?.data?.message) {
      alert(`Failed to update status: ${error.response.data.message}`)
    } else {
      alert('Failed to update status. Please try again.')
    }
  }
}
</script>