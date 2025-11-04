<template>
  <!-- Modal Backdrop -->
  <Transition name="backdrop" appear>
    <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="handleBackdropClick">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50"></div>

      <!-- Modal Card -->
      <Transition name="modal" appear>
        <Card class="relative z-50 w-full max-w-md mx-auto shadow-lg" @click.stop>
          <!-- Header -->
          <CardHeader class="pb-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus class="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle class="text-lg font-semibold">Add Participant</CardTitle>
                  <CardDescription class="text-sm">
                    Search and add a participant to this meeting
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" @click="closeModal" :disabled="isLoading">
                <X class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <!-- Content -->
          <CardContent class="space-y-4">
            <!-- Search Input -->
            <div class="space-y-2">
              <Label for="search">Search by name or email</Label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="search" v-model="searchQuery" placeholder="Type to search..." class="pl-9 pr-8"
                  :disabled="isLoading || isSearching" @input="handleSearch" />
                <!-- Clear button -->
                <button v-if="searchQuery" @click="clearSearch"
                  class="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
                  <X class="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>

            <!-- Search Results -->
            <div v-if="searchQuery.length > 0" class="space-y-3">
              <!-- Status indicator -->
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">
                  {{ isSearching ? 'Searching...' : `${filteredUsers.length} found` }}
                </span>
                <Loader2 v-if="isSearching" class="h-3 w-3 animate-spin text-muted-foreground" />
              </div>

              <!-- Loading State -->
              <div v-if="isSearching" class="flex items-center justify-center py-8">
                <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
              </div>

              <!-- No Results -->
              <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
                <UserX class="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p class="text-sm text-muted-foreground">No users found</p>
              </div>

              <!-- User List -->
              <div v-else class="space-y-1">
                <div class="max-h-64 overflow-y-auto space-y-1">
                  <button v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)" :disabled="isLoading"
                    class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left disabled:opacity-50"
                    :class="{
                      'bg-primary/10 border border-primary/20': selectedUser?.id === user.id
                    }">
                    <!-- Avatar -->
                    <div
                      class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      {{ getInitials(user.name) }}
                    </div>

                    <!-- User Info -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium">{{ user.name }}</p>
                      <p class="text-xs text-muted-foreground truncate">{{ user.email }}</p>
                    </div>

                    <!-- Selected indicator -->
                    <Check v-if="selectedUser?.id === user.id" class="h-4 w-4 text-primary flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Initial State -->
            <div v-else class="text-center py-8">
              <Search class="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p class="text-sm text-muted-foreground">Start typing to search for users</p>
            </div>

            <!-- Selected User Preview -->
            <div v-if="selectedUser" class="p-3 rounded-lg bg-muted/50 border">
              <div class="flex items-center gap-3">
                <div
                  class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-medium">
                  {{ getInitials(selectedUser.name) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium">{{ selectedUser.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ selectedUser.email }}</p>
                </div>
                <button @click="clearSelection" class="text-muted-foreground hover:text-foreground">
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p class="text-sm text-destructive">{{ error }}</p>
            </div>
          </CardContent>

          <!-- Footer -->
          <CardFooter class="flex justify-end gap-2">
            <Button variant="outline" @click="closeModal" :disabled="isLoading">
              Cancel
            </Button>
            <Button @click="handleSubmit" :disabled="!selectedUser || isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              {{ isLoading ? 'Adding...' : 'Add Participant' }}
            </Button>
          </CardFooter>
        </Card>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useParticipantStore } from '@/stores/participant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserPlus, X, Search, Check, UserX, Loader2 } from 'lucide-vue-next'

interface User {
  id: number
  name: string
  email: string
}

const props = defineProps<{
  isOpen: boolean
  meetingId: number
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const participantStore = useParticipantStore()

const searchQuery = ref('')
const selectedUser = ref<User | null>(null)
const isLoading = ref(false)
const error = ref('')
const searchResults = ref<User[]>([])
const isSearching = ref(false)

let searchTimeout: number | undefined

const filteredUsers = computed(() => {
  return searchResults.value
})

const handleSearch = async () => {
  clearTimeout(searchTimeout)

  if (searchQuery.value.length === 0) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  searchTimeout = setTimeout(async () => {
    try {
      isSearching.value = true
      error.value = ''
      console.log('Searching for:', searchQuery.value)
      const results = await participantStore.searchParticipants(
        props.meetingId,
        searchQuery.value,
        10
      )
      console.log('Search results:', results)
      console.log('Meeting ID:', props.meetingId)
      searchResults.value = results.users || []
    } catch (err: any) {
      console.error('Search error:', err)
      error.value = err.response?.data?.message || 'Failed to search users'
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

const selectUser = (user: User) => {
  selectedUser.value = user
  error.value = ''
}

const clearSelection = () => {
  selectedUser.value = null
}

const getInitials = (name: string) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleSubmit = async () => {
  if (!selectedUser.value) return

  isLoading.value = true
  error.value = ''

  try {
    await participantStore.addParticipant(props.meetingId, {
      userId: selectedUser.value.id,
      role: 'PARTICIPANT'
    })

    resetForm()
    emit('success')
    emit('close')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to add participant. They may already be in the meeting.'
    console.error('Failed to add participant:', err)
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  searchQuery.value = ''
  selectedUser.value = null
  error.value = ''
  searchResults.value = []
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
}

const handleBackdropClick = () => {
  if (!isLoading.value) {
    closeModal()
  }
}

const closeModal = () => {
  if (!isLoading.value) {
    resetForm()
    emit('close')
  }
}

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm()
  }
})
</script>
