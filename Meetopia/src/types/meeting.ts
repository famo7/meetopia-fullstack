import type { Participant } from './participant'
import type { ActionItem } from './actionItem'

export type MeetingStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED'

export interface MeetingNote {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  meetingId: number
}

export interface CreateMeetingRequest {
  title: string
  description?: string
  startTime: string
  endTime?: string
}

export interface UpdateMeetingRequest {
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  status?: MeetingStatus
}

export interface MeetingsResponse {
  meetings: Meeting[]
}

export interface MeetingResponse {
  meeting: Meeting
}

export interface Meeting {
  id: number
  title: string
  description: string
  shareLink: string
  startTime: string
  endTime?: string
  createdAt: string
  updatedAt: string
  status: MeetingStatus
  creatorId: number
  creator: {
    id: number
    name: string
    email: string
  }
  participants: Participant[]
  notes: MeetingNote | null
  actionItems: ActionItem[]
}
