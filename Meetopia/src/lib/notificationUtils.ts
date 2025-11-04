import type { Notification } from '@/types/notification'
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  PlusCircle,
  Edit,
  Calendar,
  AlertCircle
} from 'lucide-vue-next'

export const getNotificationIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    'INFO': AlertCircle,
    'SUCCESS': CheckCircle2,
    'WARNING': AlertTriangle,
    'ERROR': XCircle,
    'PARTICIPANT_ADDED': Users,
    'ACTION_ITEM_ASSIGNED': PlusCircle,
    'ACTION_ITEM_UPDATED': Edit,
    'MEETING_UPDATED': Calendar,
    'MEETING_REMINDER': Calendar
  }
  return iconMap[type] || Bell
}

export const getNotificationIconBackground = (type: string): string => {
  const colorMap: Record<string, string> = {
    'INFO': 'bg-primary/10 text-primary',
    'SUCCESS': 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    'WARNING': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    'ERROR': 'bg-destructive/10 text-destructive',
    'PARTICIPANT_ADDED': 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    'ACTION_ITEM_ASSIGNED': 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    'ACTION_ITEM_UPDATED': 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    'MEETING_UPDATED': 'bg-primary/10 text-primary',
    'MEETING_REMINDER': 'bg-primary/10 text-primary'
  }
  return colorMap[type] || 'bg-muted text-muted-foreground'
}

export const getNotificationColorClass = (type: string): string => {
  const colorMap: Record<string, string> = {
    'INFO': 'bg-primary',
    'SUCCESS': 'bg-green-500',
    'WARNING': 'bg-yellow-500',
    'ERROR': 'bg-destructive',
    'PARTICIPANT_ADDED': 'bg-purple-500',
    'ACTION_ITEM_ASSIGNED': 'bg-orange-500',
    'ACTION_ITEM_UPDATED': 'bg-orange-500',
    'MEETING_UPDATED': 'bg-primary',
    'MEETING_REMINDER': 'bg-primary'
  }
  return colorMap[type] || 'bg-muted'
}

export const getNotificationTypeLabel = (type: string): string => {
  const labelMap: Record<string, string> = {
    'INFO': 'Information',
    'SUCCESS': 'Success',
    'WARNING': 'Warning',
    'ERROR': 'Error',
    'PARTICIPANT_ADDED': 'Participant',
    'ACTION_ITEM_ASSIGNED': 'Action Item',
    'ACTION_ITEM_UPDATED': 'Action Item',
    'MEETING_UPDATED': 'Meeting',
    'MEETING_REMINDER': 'Meeting'
  }
  return labelMap[type] || 'Notification'
}

export const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  return date.toLocaleDateString()
}

export const handleNotificationNavigation = (notification: Notification, router: any) => {
  switch (notification.type) {
    case 'ACTION_ITEM_ASSIGNED':
    case 'ACTION_ITEM_UPDATED':
      router.push({ name: 'action-items' })
      break
    case 'MEETING_UPDATED':
    case 'MEETING_REMINDER':
    case 'PARTICIPANT_ADDED':
      if (notification.relatedId) {
        router.push({ name: 'meeting-detail', params: { id: notification.relatedId.toString() } })
      } else {
        router.push({ name: 'dashboard' })
      }
      break
    case 'INFO':
    case 'SUCCESS':
    case 'WARNING':
    case 'ERROR':
    default:
      router.push({ name: 'dashboard' })
      break
  }
}