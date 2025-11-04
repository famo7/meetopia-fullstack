<template>
  <div class="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 flex items-center justify-between border-b border-border">
      <div class="flex items-center gap-3">
        <div class="relative">
          <CheckSquare class="h-5 w-5 text-muted-foreground" />
          <div v-if="hasCompletedItems"
            class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card"></div>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-foreground">Action Items</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm text-muted-foreground">{{ actionItems.length }} total</span>
            <span v-if="hasPendingItems" class="text-sm text-amber-600 font-medium">
              {{ pendingItemsCount }} pending
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button @click="openCreateDialog"
          class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors">
          <Plus class="h-4 w-4" />
          <span class="hidden sm:inline">Add Item</span>
        </button>
        <button @click="toggleExpanded" class="p-2 hover:bg-accent rounded-lg transition-colors">
          <ChevronDown class="h-4 w-4 text-muted-foreground transition-transform" :class="{ 'rotate-180': isExpanded }" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-show="isExpanded">
        <div v-if="actionItems.length > 0" class="divide-y divide-border">
          <div v-for="item in sortedActionItems" :key="item.id" class="p-4 hover:bg-muted/50 transition-colors group">
            <div class="flex items-start gap-3">
              <!-- Status Checkbox -->
              <button @click="toggleItemStatus(item)"
                class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all hover:scale-105"
                :class="getStatusClasses(item.status)">
                <Check v-if="item.status === 'DONE'" class="h-3 w-3" />
                <Clock v-else-if="item.status === 'IN_PROGRESS'" class="h-3 w-3" />
              </button>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <h4 class="font-medium text-foreground text-sm leading-tight"
                      :class="{ 'line-through opacity-60': item.status === 'DONE' }">
                      {{ item.title }}
                    </h4>
                    <p v-if="item.description" class="text-muted-foreground mt-1 text-sm leading-relaxed line-clamp-2">
                      {{ item.description }}
                    </p>
                  </div>

                  <!-- Priority Badge -->
                  <div class="px-2 py-1 rounded-full text-xs font-medium flex-shrink-0"
                    :class="getPriorityClasses(item.priority)">
                    {{ item.priority }}
                  </div>
                </div>

                <!-- Meta Information -->
                <div class="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <User class="h-3 w-3" />
                    <span>{{ item.assignedTo?.name }}{{ item.assignedTo?.id === authStore.user?.id ? ' (You)' : ''
                    }}</span>
                  </div>
                  <div v-if="item.dueDate" class="flex items-center gap-1">
                    <Calendar class="h-3 w-3" />
                    <span :class="{ 'text-red-600 font-medium': isOverdue(item.dueDate) }">
                      {{ formatDate(item.dueDate) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <div class="w-2 h-2 rounded-full" :class="getStatusColor(item.status)"></div>
                    <span>{{ formatStatus(item.status) }}</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="editItem(item)"
                    class="flex items-center gap-1 px-2 py-1 hover:bg-accent rounded text-xs text-muted-foreground transition-colors">
                    <Edit class="h-3 w-3" />
                    Edit
                  </button>
                  <button @click="cycleStatus(item)"
                    class="flex items-center gap-1 px-2 py-1 hover:bg-accent rounded text-xs text-muted-foreground transition-colors">
                    <RefreshCw class="h-3 w-3" />
                    {{ getNextStatusAction(item.status) }}
                  </button>
                  <button @click="deleteItem(item)"
                    class="flex items-center gap-1 px-2 py-1 hover:bg-destructive/10 rounded text-xs text-destructive transition-colors">
                    <Trash2 class="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="px-6 py-12 text-center">
          <div class="mx-auto w-16 h-16 bg-muted rounded-xl flex items-center justify-center mb-4">
            <CheckSquare class="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 class="text-lg font-semibold text-foreground mb-2">No action items yet</h3>
          <p class="text-muted-foreground mb-6">Start collaborating by creating your first action item</p>
          <button @click="openCreateDialog"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg transition-colors">
            <Plus class="h-4 w-4" />
            Create First Item
          </button>
        </div>
      </div>
    </Transition>

    <!-- Dialogs -->
    <ActionItemCreate v-model:open="showCreateDialog" :meetingId="meetingId" :participants="participantsWithCurrentUser"
      @updated="handleItemCreated" />

    <UpdateActionItem v-model:open="showUpdateDialog" :item="editingItem" :meetingId="meetingId"
      :participants="participantsWithCurrentUser" @updated="handleItemUpdated" />

    <DeleteActionItem v-model:open="showDeleteDialog" :item="itemToDelete" :meetingId="meetingId"
      :participants="participantsWithCurrentUser" @deleted="handleItemDeleted" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActionItemStore } from '@/stores/actionItem'
import { useParticipantStore } from '@/stores/participant'
import { useAuthStore } from '@/stores/auth'
import UpdateActionItem from './UpdateActionItem.vue'
import DeleteActionItem from './DeleteActionItem.vue'
import ActionItemCreate from './ActionItemCreate.vue'
import type { ActionItem } from '@/types/actionItem'
import {
  Plus,
  CheckSquare,
  User,
  Calendar,
  RefreshCw,
  Edit,
  Trash2,
  ChevronDown,
  Check,
  Clock,
} from 'lucide-vue-next'
import type { ActionItemStatus, Priority } from '@/types/actionItem'
import type { Participant } from '@/types'


const props = defineProps<{ meetingId: number }>()

const actionItemStore = useActionItemStore()
const participantStore = useParticipantStore()
const authStore = useAuthStore()

const isExpanded = ref(true)
const showUpdateDialog = ref(false)
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const editingItem = ref<ActionItem>()
const itemToDelete = ref<ActionItem | null>(null)

const actionItems = computed(() => actionItemStore.actionItems)
const participants = computed(() => participantStore.participants)

const participantsWithCurrentUser = computed(() => {
  if (!authStore.user) return participants.value

  return [
    ...participantStore.participants,
    {
      user: authStore.user,
      id: authStore.user.id,
      meetingId: props.meetingId
    } as Participant
  ]
})

const sortedActionItems = computed(() => {
  const statusOrder = { 'OPEN': 0, 'IN_PROGRESS': 1, 'DONE': 2 }
  const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 }

  return [...actionItems.value].sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status]
    if (statusDiff !== 0) return statusDiff
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

const hasPendingItems = computed(() =>
  actionItems.value.some(item => item.status !== 'DONE')
)

const pendingItemsCount = computed(() =>
  actionItems.value.filter(item => item.status !== 'DONE').length
)

const hasCompletedItems = computed(() =>
  actionItems.value.some(item => item.status === 'DONE')
)

const loadData = async () => {
  try {
    await Promise.all([
      actionItemStore.fetchActionItems(props.meetingId),
      participantStore.fetchParticipants(props.meetingId)
    ])
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

onMounted(loadData)

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}

const openCreateDialog = () => {
  showCreateDialog.value = true
}

const getStatusClasses = (status: ActionItemStatus) => {
  switch (status) {
    case 'DONE':
      return 'bg-emerald-500 border-emerald-500 text-white'
    case 'IN_PROGRESS':
      return 'bg-blue-500 border-blue-500 text-white'
    default:
      return 'border-border hover:border-primary hover:bg-primary/10'
  }
}

const getPriorityClasses = (priority: Priority) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    case 'MEDIUM':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    case 'LOW':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

const getStatusColor = (status: ActionItemStatus) => {
  switch (status) {
    case 'OPEN':
      return 'bg-muted-foreground'
    case 'IN_PROGRESS':
      return 'bg-blue-500'
    case 'DONE':
      return 'bg-emerald-500'
    default:
      return 'bg-muted-foreground'
  }
}

const formatStatus = (status: ActionItemStatus) => {
  switch (status) {
    case 'OPEN':
      return 'Open'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'DONE':
      return 'Completed'
    default:
      return status
  }
}

const getNextStatusAction = (currentStatus: ActionItemStatus) => {
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (isToday) return 'Today'

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const isOverdue = (dateString: string) => {
  const dueDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return dueDate < today
}

const editItem = (item: ActionItem) => {
  editingItem.value = item
  showUpdateDialog.value = true
}

const deleteItem = (item: ActionItem) => {
  itemToDelete.value = item
  showDeleteDialog.value = true
}

const toggleItemStatus = async (item: ActionItem) => {
  try {
    const statusCycle: Record<string, ActionItemStatus> = {
      'OPEN': 'IN_PROGRESS',
      'IN_PROGRESS': 'DONE',
      'DONE': 'OPEN'
    }
    const newStatus = statusCycle[item.status]
    await actionItemStore.updateActionItem(props.meetingId, item.id, { status: newStatus })
    await actionItemStore.fetchActionItems(props.meetingId)
  } catch (error) {
    console.error('Failed to toggle item status:', error)
  }
}

const cycleStatus = async (item: ActionItem) => {
  try {
    let newStatus: ActionItemStatus
    switch (item.status) {
      case 'OPEN':
        newStatus = 'IN_PROGRESS'
        break
      case 'IN_PROGRESS':
        newStatus = 'DONE'
        break
      case 'DONE':
        newStatus = 'OPEN'
        break
      default:
        newStatus = 'OPEN'
    }
    await actionItemStore.updateActionItem(props.meetingId, item.id, { status: newStatus })
    await actionItemStore.fetchActionItems(props.meetingId)
  } catch (error) {
    console.error('Failed to cycle item status:', error)
  }
}

const handleItemCreated = () => loadData()
const handleItemUpdated = () => loadData()
const handleItemDeleted = () => loadData()
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>