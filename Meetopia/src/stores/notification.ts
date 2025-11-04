import { defineStore } from 'pinia'
import { ref } from 'vue'
import { io, Socket } from 'socket.io-client'
import api from '@/lib/axios'
import type { Notification } from '@/types/notification'

const API = import.meta.env.VITE_API_URL

export const useNotificationStore = defineStore('notifications', () => {

  const notifications = ref<Notification[]>([])
  const unreadCount = ref(0)
  const socket = ref<Socket | null>(null)
  const isLoading = ref(false)

  const initSocket = async (userId: number) => {
    if (socket.value?.connected) return

    socket.value = io(API, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    })

    socket.value.on('connect', () => {
      socket.value?.emit('identify', { userId })
    })

    socket.value.on('notification', (notification: any) => {
      const isRead = notification.isRead ?? notification.read ?? false

      const processedNotification = {
        ...notification,
        isRead,
        createdAt: new Date(notification.createdAt),
        updatedAt: new Date(notification.updatedAt || notification.createdAt)
      }

      notifications.value.unshift(processedNotification)

      if (!isRead) {
        unreadCount.value++
      }
    })
  }

  const disconnectSocket = () => {
    if (!socket.value) return
    socket.value.disconnect()
    socket.value = null
    notifications.value = []
    unreadCount.value = 0
  }

  const fetchNotifications = async (limit = 50, offset = 0) => {
    try {
      isLoading.value = true
      const { data } = await api.get('/notifications', {
        params: { limit, offset }
      })

      notifications.value = (data.notifications || []).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
        updatedAt: new Date(n.updatedAt)
      }))

      unreadCount.value = data.unreadCount ?? notifications.value.filter(n => !n.isRead).length
    } finally {
      isLoading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/count')
      unreadCount.value = data.unreadCount ?? 0
    } catch (error) {
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read')
      notifications.value = notifications.value.map(n => ({ ...n, isRead: true }))
      unreadCount.value = 0
    } catch (error) {
      throw error
    }
  }

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`)

      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.isRead) {
        notification.isRead = true
        unreadCount.value -= 1
      }
    } catch (error) {
      throw error
    }
  }

  const markNotificationAsUnread = async (notificationId: number) => {
    try {
      await api.patch(`/notifications/${notificationId}/unread`)

      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && notification.isRead) {
        notification.isRead = false
        unreadCount.value += 1
      }
    } catch (error) {
      throw error
    }
  }

  const removeAllNotifications = async () => {
    try {
      await api.delete('/notifications/remove-all')
      notifications.value = []
      unreadCount.value = 0
    } catch (error) {
      throw error
    }
  }

  const clearNotifications = () => {
    notifications.value = []
    unreadCount.value = 0
  }

  return {
    notifications,
    unreadCount,
    isLoading,

    initSocket,
    disconnectSocket,
    fetchNotifications,
    fetchUnreadCount,
    markAllAsRead,
    markNotificationAsRead,
    markNotificationAsUnread,
    removeAllNotifications,
    clearNotifications
  }
})