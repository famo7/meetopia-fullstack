import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'
import { useAuthStore } from './auth'
import type {
  Meeting,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  MeetingResponse,
  MeetingsResponse
} from '@/types/meeting'

export const useMeetingStore = defineStore('meeting', () => {
  // State
  const meetings = ref<Meeting[]>([])
  const currentMeeting = ref<Meeting | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const upcomingMeetings = computed(() => {
    const now = new Date()
    return (meetings.value || []).filter(m => new Date(m.startTime) > now && m.status === 'SCHEDULED')
  })

  const pastMeetings = computed(() => {
    const now = new Date()
    return (meetings.value || []).filter(m => new Date(m.startTime) <= now || m.status === 'ENDED')
  })

  const activeMeetings = computed(() => {
    return (meetings.value || []).filter(m => m.status === 'ACTIVE')
  })

  // Actions
  const fetchMeetings = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<MeetingsResponse>('/meetings')
      // Backend returns { meetings: [...] } not a direct array
      meetings.value = response.data.meetings || []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load meetings'
      meetings.value = [] // Reset to empty array on error
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchMeetingById = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<MeetingResponse>(`/meetings/${id}`)
      currentMeeting.value = response.data.meeting
      return currentMeeting.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load meeting'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createMeeting = async (data: CreateMeetingRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post<MeetingResponse>('/meetings', data)
      const newMeeting = response.data.meeting

      const authStore = useAuthStore()

      // Add creator info if missing (use current user)
      if (!newMeeting.creator && authStore.user) {
        newMeeting.creator = {
          id: typeof authStore.user.id === 'string' ? parseInt(authStore.user.id) : authStore.user.id,
          name: authStore.user.name,
          email: authStore.user.email,
        }
      }

      // Add empty participants array if missing
      if (!newMeeting.participants) {
        newMeeting.participants = []
      }

      // Add empty action items array if missing
      if (!newMeeting.actionItems) {
        newMeeting.actionItems = []
      }

      // Add to the beginning of the array with spread operator for reactivity
      meetings.value = [newMeeting, ...meetings.value]

      return newMeeting
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create meeting'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateMeeting = async (id: number, data: UpdateMeetingRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.put<MeetingResponse>(`/meetings/${id}`, data)
      const updatedMeeting = response.data.meeting

      meetings.value = meetings.value.map(m => m.id === id ? updatedMeeting as Meeting : m)

      // Update current meeting if it's the same
      if (currentMeeting.value?.id === id) {
        currentMeeting.value = updatedMeeting
      }

      return updatedMeeting
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update meeting'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteMeeting = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/meetings/${id}`)

      meetings.value = meetings.value.filter(m => m.id !== id)

      // Clear current meeting if it's the deleted one
      if (currentMeeting.value?.id === id) {
        clearCurrentMeeting()
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete meeting'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentMeeting = () => {
    currentMeeting.value = null
  }

  return {
    // State
    meetings,
    currentMeeting,
    isLoading,
    error,
    // Computed
    upcomingMeetings,
    pastMeetings,
    activeMeetings,
    // Actions
    fetchMeetings,
    fetchMeetingById,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    clearError,
    clearCurrentMeeting,
  }
})
