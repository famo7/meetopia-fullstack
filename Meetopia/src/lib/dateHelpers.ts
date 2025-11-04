import { format, isToday, isTomorrow, parseISO, isPast } from 'date-fns'


export const formatMeetingTime = (date: string | Date) => {
  const meetingDate = typeof date === 'string' ? parseISO(date) : date

  if (isToday(meetingDate)) {
    return `Today, ${format(meetingDate, 'h:mm a')}`
  } else if (isTomorrow(meetingDate)) {
    return `Tomorrow, ${format(meetingDate, 'h:mm a')}`
  } else {
    return format(meetingDate, 'MMM d, h:mm a')
  }
}


export function formatMeetingDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}


export const formatDueDate = (date: string | Date) => {
  const dueDate = typeof date === 'string' ? parseISO(date) : date

  if (isToday(dueDate)) return 'Today'
  if (isTomorrow(dueDate)) return 'Tomorrow'

  return format(dueDate, 'MMM d')
}

export const formatFullDate = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMMM d, yyyy')
}


export const formatTime = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'h:mm a')
}


export const isOverdue = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return isPast(d) && !isToday(d)
}


export const formatDueDateWithOverdue = (date: string | Date) => {
  const dueDate = typeof date === 'string' ? parseISO(date) : date
  const formatted = formatDueDate(dueDate)

  if (isOverdue(dueDate)) {
    return `${formatted} (overdue)`
  }

  return formatted
}
