<template>
  <div class="h-full flex flex-col">
    <!-- Loading State -->
    <div v-if="meetingStore.isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p class="text-muted-foreground">Loading meetings...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="meetingStore.error" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <AlertCircle class="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p class="text-destructive mb-4">{{ meetingStore.error }}</p>
        <Button @click="meetingStore.fetchMeetings()">Try Again</Button>
      </div>
    </div>

    <!-- Calendar View -->
    <MeetingCalendar 
      v-else 
      @create-meeting="showCreateDialog = true"
    />

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
import { ref, onMounted } from 'vue'
import { useMeetingStore } from '@/stores/meeting'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-vue-next'
import MeetingCalendar from '@/components/MeetingCalendar.vue'
import CreateMeeting from '@/components/CreateMeeting.vue'

const meetingStore = useMeetingStore()
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)
const isDeleting = ref(false)
const meetingToDelete = ref<{ id: number, title: string }>({ id: 0, title: '' })

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
  showCreateDialog.value = false
}

onMounted(async () => {
  await meetingStore.fetchMeetings()
})
</script>
