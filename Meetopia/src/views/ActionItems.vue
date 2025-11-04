<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-7xl mx-auto p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-foreground mb-2">Action Items</h1>
        <p class="text-muted-foreground">Overview of all action items across your meetings</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Total</p>
                <p class="text-2xl font-bold text-foreground">{{ stats.total }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ListTodo class="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Open</p>
                <p class="text-2xl font-bold text-blue-600">{{ stats.open }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Circle class="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">In Progress</p>
                <p class="text-2xl font-bold text-purple-600">{{ stats.inProgress }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Clock class="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="pt-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-muted-foreground">Completed</p>
                <p class="text-2xl font-bold text-green-600">{{ stats.done }}</p>
              </div>
              <div class="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 class="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Tabs for filtering -->
      <div class="mb-6 border-b border-border">
        <nav class="-mb-px flex space-x-8">
          <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
            activeTab === tab.value
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]">
            {{ tab.label }}
            <span v-if="tab.count > 0" :class="[
              activeTab === tab.value
                ? 'bg-primary/10 text-primary'
                : 'bg-muted text-muted-foreground',
              'ml-2 py-0.5 px-2 rounded-full text-xs font-medium'
            ]">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Loading action items...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <AlertCircle class="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p class="text-destructive mb-4">{{ error }}</p>
        <Button @click="loadAllActionItems">Try Again</Button>
      </div>

      <!-- Action Items List (Read-only) -->
      <div v-else class="space-y-6">
        <!-- Grouped by Meeting -->
        <div v-for="meeting in filteredMeetings" :key="meeting.id">
          <Card class="border-border shadow-sm">
            <CardHeader class="pb-4 border-b border-border">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-lg font-semibold text-foreground">{{ meeting.title }}</CardTitle>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ formatFullDate(meeting.startTime) }} • {{ meeting.actionItems.length }} items
                  </p>
                </div>
                <Button variant="default" size="sm" @click="goToMeeting(meeting.id)">
                  <Video class="mr-2 h-4 w-4" />
                  Go to Meeting
                </Button>
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <!-- Read-only list of action items -->
              <div class="space-y-3">
                <div v-for="item in meeting.actionItems" :key="item.id"
                  class="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <!-- Status indicator -->
                  <div class="flex-shrink-0 mt-1">
                    <div :class="[
                      'h-2 w-2 rounded-full',
                      item.status === 'DONE' ? 'bg-green-500' :
                        item.status === 'IN_PROGRESS' ? 'bg-purple-500' : 'bg-blue-500'
                    ]"></div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <p :class="[
                      'text-sm font-medium',
                      item.status === 'DONE' ? 'line-through text-muted-foreground' : 'text-foreground'
                    ]">
                      {{ item.title }}
                    </p>
                    <p v-if="item.description" class="text-xs text-muted-foreground mt-1">
                      {{ item.description }}
                    </p>
                    <div class="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span class="flex items-center gap-1">
                        <User class="h-3 w-3" />
                        {{ item.assignedTo.name }}
                      </span>
                      <span v-if="item.dueDate" :class="[
                        'flex items-center gap-1',
                        isPastDue(item.dueDate) && item.status !== 'DONE' ? 'text-red-600 font-medium' : ''
                      ]">
                        <CalendarIcon class="h-3 w-3" />
                        {{ formatDate(item.dueDate) }}
                      </span>
                      <Badge :variant="getStatusVariant(item.status)" class="text-xs">
                        {{ formatStatus(item.status) }}
                      </Badge>
                      <Badge v-if="item.priority" :variant="getPriorityVariant(item.priority)" class="text-xs">
                        {{ item.priority }}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div v-if="filteredMeetings.length === 0" class="text-center py-12">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ListTodo class="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p class="text-lg font-medium text-foreground mb-1">No action items found</p>
          <p class="text-sm text-muted-foreground mb-4">
            {{ getEmptyStateMessage() }}
          </p>
          <Button @click="$router.push('/dashboard/meetings')">
            Go to Meetings
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetingStore } from '@/stores/meeting'
import { useAuthStore } from '@/stores/auth'
import { formatFullDate } from '@/lib/dateHelpers'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle,
  ListTodo,
  Circle,
  Clock,
  CheckCircle2,
  User,
  Calendar as CalendarIcon,
  Video
} from 'lucide-vue-next'

const router = useRouter()
const meetingStore = useMeetingStore()
const authStore = useAuthStore()

const activeTab = ref<'all' | 'assigned' | 'created'>('all')
const isLoading = ref(false)
const error = ref<string | null>(null)

const allActionItems = computed(() => {
  return meetingStore.meetings.flatMap(m =>
    (m.actionItems || []).map(item => ({
      ...item,
      meetingId: m.id,
      meetingTitle: m.title
    }))
  )
})

const stats = computed(() => {
  const items = allActionItems.value
  return {
    total: items.length,
    open: items.filter(i => i.status === 'OPEN').length,
    inProgress: items.filter(i => i.status === 'IN_PROGRESS').length,
    done: items.filter(i => i.status === 'DONE').length
  }
})

const tabs = computed(() => [
  { value: 'all' as const, label: 'All Items', count: allActionItems.value.length },
  {
    value: 'assigned' as const,
    label: 'Assigned to Me',
    count: allActionItems.value.filter(i => i.assignedTo.id === authStore.user?.id).length
  },
  {
    value: 'created' as const,
    label: 'Created by Me',
    count: allActionItems.value.filter(i => i.assignedBy.id === authStore.user?.id).length
  }
])

const filteredMeetings = computed(() => {
  const grouped = new Map()

  meetingStore.meetings.forEach(meeting => {
    if (!meeting.actionItems || meeting.actionItems.length === 0) return

    let filteredItems = meeting.actionItems

    if (activeTab.value === 'assigned') {
      filteredItems = filteredItems.filter(i => i.assignedTo.id === authStore.user?.id)
    } else if (activeTab.value === 'created') {
      filteredItems = filteredItems.filter(i => i.assignedBy.id === authStore.user?.id)
    }

    if (filteredItems.length > 0) {
      grouped.set(meeting.id, {
        ...meeting,
        actionItems: filteredItems
      })
    }
  })

  return Array.from(grouped.values()).sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  )
})

const getEmptyStateMessage = () => {
  switch (activeTab.value) {
    case 'assigned':
      return 'You have no action items assigned to you'
    case 'created':
      return 'You have not created any action items yet'
    default:
      return 'Action items will appear here as you create them during meetings'
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'DONE': return 'default'
    case 'IN_PROGRESS': return 'secondary'
    default: return 'outline'
  }
}

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'HIGH': return 'destructive'
    case 'MEDIUM': return 'default'
    default: return 'secondary'
  }
}

const formatStatus = (status: string) => {
  return status.replace('_', ' ')
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isPastDue = (dueDate: string) => {
  return new Date(dueDate) < new Date()
}

const goToMeeting = (meetingId: number) => {
  router.push(`/dashboard/meetings/${meetingId}`)
}

const loadAllActionItems = async () => {
  isLoading.value = true
  error.value = null

  try {
    await meetingStore.fetchMeetings()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load action items'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadAllActionItems()
})
</script>