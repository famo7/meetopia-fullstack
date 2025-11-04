import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'
import type { DashboardResponse, Dashboard } from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const data = ref<Dashboard | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const today = computed(() => data.value?.today || null)
  const thisWeek = computed(() => data.value?.thisWeek || null)
  const upcoming = computed(() => data.value?.upcoming || null)
  const actionItems = computed(() => data.value?.actionItems || null)
  const totals = computed(() => data.value?.totals || null)

  const fetchDashboard = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<DashboardResponse>('/dashboard')
      data.value = response.data.dashboard
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load dashboard'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshDashboard = async () => {
    await fetchDashboard()
  }

  return {
    // State
    data,
    isLoading,
    error,
    // Computed
    today,
    thisWeek,
    upcoming,
    actionItems,
    totals,
    // Actions
    fetchDashboard,
    refreshDashboard,
  }
})