<template>
  <!-- Modal Backdrop -->
  <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="fixed inset-0 bg-black/50" @click="closeModal"></div>

    <!-- Modal Card -->
    <Card class="relative z-50 w-full max-w-lg">
      <!-- Header -->
      <CardHeader>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CalendarIcon class="h-4 w-4 text-primary" />
            </div>
            <CardTitle>Edit Meeting</CardTitle>
          </div>
          <Button variant="ghost" size="sm" @click="closeModal" :disabled="isLoading">
            <X class="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>Update the details of your meeting</CardDescription>
      </CardHeader>

      <!-- Form -->
      <CardContent class="space-y-4">
        <!-- Permission Error -->
        <div v-if="!isCreator" class="flex gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <AlertCircle class="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p class="text-xs text-destructive">
            Only the meeting creator can edit this meeting.
          </p>
        </div>

        <!-- Title Field -->
        <div class="space-y-2">
          <Label for="title">
            Meeting Title
            <span class="text-destructive">*</span>
          </Label>
          <Input id="title" v-model="formData.title" placeholder="e.g., Weekly Team Sync"
            :disabled="isLoading || !isCreator" maxlength="200" />
          <p v-if="errors.title" class="text-sm text-destructive">{{ errors.title }}</p>
          <p class="text-xs text-muted-foreground">{{ formData.title.length }}/200</p>
        </div>

        <!-- Date & Time Row -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Date Picker -->
          <div class="space-y-2">
            <Label>
              Date
              <span class="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" :class="cn(
                  'w-full justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                )" :disabled="isLoading || !isCreator">
                  <CalendarIcon class="mr-2 h-4 w-4" />
                  {{ selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : 'Pick a date' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar v-model="selectedDate" :min-value="today(getLocalTimeZone())" initial-focus />
              </PopoverContent>
            </Popover>
            <p v-if="errors.date" class="text-sm text-destructive">{{ errors.date }}</p>
          </div>

          <!-- Time Picker -->
          <div class="space-y-2">
            <Label>
              Time
              <span class="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" :class="cn(
                  'w-full justify-start text-left font-normal',
                  !selectedTime && 'text-muted-foreground',
                )" :disabled="isLoading || !isCreator">
                  <Clock class="mr-2 h-4 w-4" />
                  {{ selectedTime || 'Select time' }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start">
                <div class="p-3">
                  <div class="flex gap-2">
                    <div class="flex-1">
                      <Label class="text-xs text-muted-foreground mb-1 block">Hour</Label>
                      <select v-model="selectedHour"
                        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        @change="updateTime">
                        <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
                      </select>
                    </div>
                    <div class="flex-1">
                      <Label class="text-xs text-muted-foreground mb-1 block">Minute</Label>
                      <select v-model="selectedMinute"
                        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        @change="updateTime">
                        <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <p v-if="errors.time" class="text-sm text-destructive">{{ errors.time }}</p>
          </div>
        </div>

        <!-- Description Field -->
        <div class="space-y-2">
          <Label for="description">
            Description
            <span class="text-xs text-muted-foreground">(Optional)</span>
          </Label>
          <textarea id="description" v-model="formData.description" rows="3"
            class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Add meeting details, agenda, or notes..." :disabled="isLoading || !isCreator"
            maxlength="1000"></textarea>
          <p class="text-xs text-muted-foreground">{{ formData.description.length }}/1000</p>
        </div>
      </CardContent>

      <!-- Footer -->
      <CardFooter class="flex justify-end gap-2">
        <Button variant="outline" @click="closeModal" :disabled="isLoading">
          Cancel
        </Button>
        <Button @click="handleSubmit" :disabled="isLoading || !isCreator">
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useMeetingStore } from '@/stores/meeting'
import { useAuthStore } from '@/stores/auth'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, X, Clock, Loader2, AlertCircle } from 'lucide-vue-next'
import type { DateValue } from '@internationalized/date'
import { DateFormatter, getLocalTimeZone, today, parseDate } from '@internationalized/date'
import { cn } from '@/lib/utils'
import type { Meeting } from '@/types/meeting'

const props = defineProps<{
  isOpen: boolean
  meeting: Meeting | null
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const meetingStore = useMeetingStore()
const authStore = useAuthStore()

// Date formatter
const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

// Check if current user is the creator
const isCreator = computed(() => {
  if (!props.meeting || !authStore.user) return false
  const creatorId = typeof props.meeting.creator.id === 'string'
    ? parseInt(props.meeting.creator.id)
    : props.meeting.creator.id
  const currentUserId = typeof authStore.user.id === 'string'
    ? parseInt(authStore.user.id)
    : authStore.user.id
  return creatorId === currentUserId
})

// Form state
const formData = ref({
  title: '',
  description: '',
})

const selectedDate = ref<DateValue>()
const selectedTime = ref('')
const selectedHour = ref('09')
const selectedMinute = ref('00')
const isLoading = ref(false)
const errors = ref({
  title: '',
  date: '',
  time: '',
})

// Generate hours and minutes arrays
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = ['00', '15', '30', '45']

// Update time when hour/minute changes
const updateTime = () => {
  selectedTime.value = `${selectedHour.value}:${selectedMinute.value}`
}

// Load meeting data into form
const loadMeetingData = () => {
  if (!props.meeting) return

  // Set form data
  formData.value = {
    title: props.meeting.title,
    description: props.meeting.description || '',
  }

  // Parse and set date/time
  const meetingDate = new Date(props.meeting.startTime)

  // Convert to DateValue for calendar
  const year = meetingDate.getFullYear()
  const month = String(meetingDate.getMonth() + 1).padStart(2, '0')
  const day = String(meetingDate.getDate()).padStart(2, '0')
  selectedDate.value = parseDate(`${year}-${month}-${day}`)

  // Set time
  const hours = String(meetingDate.getHours()).padStart(2, '0')
  const minutes = String(meetingDate.getMinutes()).padStart(2, '0')
  selectedHour.value = hours
  selectedMinute.value = minutes
  selectedTime.value = `${hours}:${minutes}`
}

// Watch for modal open and load data
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.meeting) {
    loadMeetingData()
    errors.value = { title: '', date: '', time: '' }
  }
})

const validateForm = (): boolean => {
  errors.value = { title: '', date: '', time: '' }
  let isValid = true

  // Validate title
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required'
    isValid = false
  } else if (formData.value.title.length > 200) {
    errors.value.title = 'Title must be less than 200 characters'
    isValid = false
  }

  // Validate date
  if (!selectedDate.value) {
    errors.value.date = 'Date is required'
    isValid = false
  }

  // Validate time
  if (!selectedTime.value) {
    errors.value.time = 'Time is required'
    isValid = false
  }

  // Validate datetime is at least 5 minutes from now
  if (selectedDate.value && selectedTime.value) {
    const [hours, minutes] = selectedTime.value.split(':').map(Number)
    const dateTime = selectedDate.value.toDate(getLocalTimeZone())
    dateTime.setHours(hours, minutes, 0, 0)

    const now = new Date()
    const minTime = new Date(now.getTime() + 5 * 60 * 1000)

    if (dateTime < minTime) {
      errors.value.time = 'Meeting must be scheduled at least 5 minutes from now'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!props.meeting || !isCreator.value) return
  if (!validateForm()) return

  isLoading.value = true

  try {
    const [hours, minutes] = selectedTime.value.split(':').map(Number)
    const dateTime = selectedDate.value!.toDate(getLocalTimeZone())
    dateTime.setHours(hours, minutes, 0, 0)

    await meetingStore.updateMeeting(props.meeting.id, {
      title: formData.value.title.trim(),
      description: formData.value.description.trim() || undefined,
      startTime: dateTime.toISOString(),
    })

    // Success! Emit success, then close
    emit('success')
    emit('close')
  } catch (error) {
    console.error('Failed to update meeting:', error)
    // Keep modal open on error so user can retry
  } finally {
    isLoading.value = false
  }
}

const closeModal = () => {
  if (!isLoading.value) {
    errors.value = { title: '', date: '', time: '' }
    emit('close')
  }
}
</script>