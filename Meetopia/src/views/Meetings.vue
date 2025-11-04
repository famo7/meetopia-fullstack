<template>
  <div class="p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-foreground mb-2">Meetings</h1>
          <p class="text-muted-foreground">Manage and track all your meetings</p>
        </div>
        <Button @click="showCreateDialog = true">
          <Plus class="h-5 w-5 mr-2" />
          Create Meeting
        </Button>
      </div>

      <!-- Loading State -->
      <div v-if="meetingStore.isLoading" class="flex items-center justify-center py-12">
        <div class="flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p class="text-muted-foreground">Loading meetings...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="meetingStore.error" class="text-center py-12">
        <AlertCircle class="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p class="text-destructive mb-4">{{ meetingStore.error }}</p>
        <Button @click="meetingStore.fetchMeetings()">Try Again</Button>
      </div>

      <!-- Content -->
      <template v-else>
        <!-- Search and Filters -->
        <div class="flex items-center gap-4 mb-6">
          <div class="relative flex-1 max-w-md">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery" placeholder="Search by title..." class="pl-10" />
          </div>
          <div class="flex gap-2">
            <Button variant="outline" :class="{ 'bg-primary/10 text-primary border-primary': activeTab === 'upcoming' }"
              @click="activeTab = 'upcoming'">
              Upcoming
            </Button>
            <Button variant="outline" :class="{ 'bg-primary/10 text-primary border-primary': activeTab === 'past' }"
              @click="activeTab = 'past'">
              Past
            </Button>
            <Button variant="outline" :class="{ 'bg-primary/10 text-primary border-primary': activeTab === 'all' }"
              @click="activeTab = 'all'">
              All
            </Button>
          </div>
        </div>

        <!-- Meetings Table -->
        <Card>
          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="border-b border-border bg-muted/50">
                  <tr>
                    <th class="text-left p-4 text-sm font-medium text-muted-foreground">TITLE</th>
                    <th class="text-left p-4 text-sm font-medium text-muted-foreground">DATE/TIME</th>
                    <th class="text-left p-4 text-sm font-medium text-muted-foreground">STATUS</th>
                    <th class="text-left p-4 text-sm font-medium text-muted-foreground">PARTICIPANTS</th>
                    <th class="text-left p-4 text-sm font-medium text-muted-foreground">ACTION ITEMS</th>
                    <th class="text-left p-4 text-sm font-medium text-muted-foreground">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="meeting in filteredMeetings" :key="meeting.id"
                    class="border-b border-border hover:bg-accent/50 transition-colors">
                    <td class="p-4">
                      <p class="font-medium text-foreground">{{ meeting.title }}</p>
                      <p v-if="meeting.description" class="text-sm text-muted-foreground truncate max-w-md">
                        {{ meeting.description }}
                      </p>
                    </td>
                    <td class="p-4 text-sm text-muted-foreground">
                      {{ formatMeetingTime(meeting.startTime) }}
                    </td>
                    <td class="p-4">
                      <Badge :variant="getStatusVariant(meeting.status)">
                        {{ meeting.status }}
                      </Badge>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <Users class="h-4 w-4 text-muted-foreground" />
                        <span class="text-sm text-muted-foreground">{{ meeting.participants?.length || 0 }}</span>
                      </div>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <CheckCircle2 class="h-4 w-4 text-muted-foreground" />
                        <span class="text-sm text-muted-foreground">{{ meeting.actionItems?.length || 0 }}</span>
                      </div>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-2">
                        <Button variant="ghost" size="sm" @click="viewMeeting(meeting.id)">
                          View
                        </Button>
                        <Button v-if="isUserCreator(meeting)" variant="ghost" size="sm"
                          @click="openDeleteDialog(meeting.id, meeting.title)"
                          class="text-destructive hover:text-destructive">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Empty State -->
              <div v-if="filteredMeetings.length === 0" class="text-center py-12 text-muted-foreground">
                <Calendar class="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No meetings found</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/50" @click="cancelDelete"></div>

      <!-- Dialog -->
      <div class="relative bg-background border rounded-lg shadow-lg max-w-md w-full mx-4 p-6 space-y-4">
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle class="h-5 w-5 text-destructive" />
          </div>
          <div class="flex-1 space-y-2">
            <h2 class="text-lg font-semibold">Delete Meeting</h2>
            <p class="text-sm text-muted-foreground">
              Are you sure you want to delete <span class="font-medium text-foreground">"{{ meetingToDelete.title
              }}"</span>?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <Button variant="outline" @click="cancelDelete" :disabled="isDeleting">
            Cancel
          </Button>
          <Button variant="destructive" @click="confirmDelete" :disabled="isDeleting">
            <span v-if="isDeleting" class="flex items-center gap-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Deleting...
            </span>
            <span v-else>Delete</span>
          </Button>
        </div>
      </div>
    </div>

    <!-- Create Meeting Modal -->
    <CreateMeeting :is-open="showCreateDialog" @close="showCreateDialog = false" @success="handleMeetingCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetingStore } from '@/stores/meeting'
import { useAuthStore } from '@/stores/auth'
import { formatMeetingTime } from '@/lib/dateHelpers'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Plus, Search, Calendar, Users, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import type { Meeting } from '@/types/meeting'
import CreateMeeting from '@/components/CreateMeeting.vue'

const router = useRouter()
const meetingStore = useMeetingStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const activeTab = ref<'upcoming' | 'past' | 'all'>('upcoming')
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)
const meetingToDelete = ref<{ id: number, title: string }>({ id: 0, title: '' })

// Computed filtered meetings
const filteredMeetings = computed(() => {
  let result = meetingStore.meetings

  // Filter by tab
  if (activeTab.value === 'upcoming') {
    result = meetingStore.upcomingMeetings
  } else if (activeTab.value === 'past') {
    result = meetingStore.pastMeetings
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m =>
      m.title.toLowerCase().includes(query) ||
      m.description?.toLowerCase().includes(query)
    )
  }

  return result
})

// Check if current user is the creator of the meeting
const isUserCreator = (meeting: Meeting) => {
  if (!authStore.user?.id) return false
  // Convert user id to number for comparison
  const userId = typeof authStore.user.id === 'string' ? parseInt(authStore.user.id) : authStore.user.id
  return userId === meeting.creatorId
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'default'
    case 'ACTIVE': return 'default'
    case 'ENDED': return 'secondary'
    case 'CANCELLED': return 'destructive'
    default: return 'default'
  }
}

const viewMeeting = async (id: number) => {
  router.push(`/dashboard/meetings/${id}`)
}

const openDeleteDialog = (id: number, title: string) => {
  meetingToDelete.value = { id, title }
  showDeleteDialog.value = true
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  meetingToDelete.value = { id: 0, title: '' }
}

const confirmDelete = async () => {
  isDeleting.value = true
  try {
    await meetingStore.deleteMeeting(meetingToDelete.value.id)
    showDeleteDialog.value = false
    meetingToDelete.value = { id: 0, title: '' }
  } catch (error) {
    console.error('Failed to delete meeting:', error)
  } finally {
    isDeleting.value = false
  }
}

const handleMeetingCreated = () => {
  // Meeting store already added the new meeting in createMeeting action
  // No need to refetch - just close the dialog
  showCreateDialog.value = false
}

onMounted(async () => {
  await meetingStore.fetchMeetings()
})
</script>
