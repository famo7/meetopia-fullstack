import type { User } from './user'

export type ActionItemStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface ActionItem {
  id: number
  title: string
  description: string
  status: ActionItemStatus
  priority: Priority
  dueDate: string | null
  isCompleted: boolean
  createdAt: string
  updatedAt: string
  meetingId: number
  createdById: number
  assignedById: number
  assignedToId: number
  createdBy: User
  assignedBy: User
  assignedTo: User
}

export interface CreateActionItemRequest {
  title: string
  description?: string
  assignedToId?: number
  status?: ActionItemStatus
  priority?: Priority
  dueDate?: string | Date
}

export interface UpdateActionItemRequest {
  title?: string
  description?: string
  assignedToId?: number | null
  status?: ActionItemStatus
  priority?: Priority
  dueDate?: string | Date | null
  isCompleted?: boolean
}
