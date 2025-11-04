
import type { Meeting } from './meeting'
import type { ActionItem } from './actionItem'
import type { User } from './user'

export interface DashboardResponse {
  dashboard: Dashboard
}

export interface Dashboard {
  today: Today
  thisWeek: ThisWeek
  upcoming: Upcoming
  actionItems: ActionItemsData
  totals: Totals
}

export interface Today {
  meetings: DashboardMeeting[]
  meetingsCount: number
}

export interface ThisWeek {
  meetingsCount: number
  actionItemsDueCount: number
}

export interface Upcoming {
  meetings: DashboardMeeting[]
  meetingsCount: number
}

// Extends Meeting with count data
export interface DashboardMeeting extends Meeting {
  _count: {
    actionItems: number
    participants: number
  }
}

export interface ActionItemsData {
  pending: DashboardActionItem[]
  pendingCount: number
  totalCount: number
  completedCount: number
}

// Extends ActionItem with meeting and user details
export interface DashboardActionItem extends ActionItem {
  meeting: {
    id: number
    title: string
    date: string
    status: string
  }
  assignedBy: User
  assignedTo: User
}

export interface Totals {
  meetings: number
  actionItems: number
  completedActionItems: number
}