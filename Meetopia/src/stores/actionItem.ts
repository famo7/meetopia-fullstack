import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'
import type { ActionItem, CreateActionItemRequest, UpdateActionItemRequest } from '@/types/actionItem'


export const useActionItemStore = defineStore('actionItem', () => {
  const actionItems = ref<ActionItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)


  const fetchActionItems = async (meetingId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get(`/meetings/${meetingId}/action-items`)
      // Backend returns { actionItems: [...] }
      actionItems.value = response.data.actionItems || response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch action items'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createActionItem = async (meetingId: number, data: CreateActionItemRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post(`/meetings/${meetingId}/action-items`, data)

      actionItems.value.unshift(response.data)

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create action item'
      throw err
    } finally {
      isLoading.value = false
    }
  }


  const updateActionItem = async (
    meetingId: number,
    actionItemId: number,
    data: UpdateActionItemRequest
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.put(
        `/meetings/${meetingId}/action-items/${actionItemId}`,
        data
      )

      const updatedItem = response.data.actionItem || response.data

      const index = actionItems.value.findIndex(item => item.id === actionItemId)
      if (index !== -1) {
        actionItems.value[index] = updatedItem
      }

      return updatedItem
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update action item'
      throw err
    } finally {
      isLoading.value = false
    }
  }


  const deleteActionItem = async (meetingId: number, actionItemId: number) => {
    isLoading.value = true
    error.value = null

    try {
      await api.delete(`/meetings/${meetingId}/action-items/${actionItemId}`)

      actionItems.value = actionItems.value.filter(item => item.id !== actionItemId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete action item'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const resetStore = () => {
    actionItems.value = []
    isLoading.value = false
    error.value = null
  }

  return {
    actionItems,
    isLoading,
    error,

    fetchActionItems,
    createActionItem,
    updateActionItem,
    deleteActionItem,
    resetStore
  }
})
