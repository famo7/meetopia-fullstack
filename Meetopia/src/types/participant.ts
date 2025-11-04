export type ParticipantRole = 'PARTICIPANT' | 'CREATOR'

export interface Participant {
  id: number
  createdAt: string
  updatedAt: string
  role: ParticipantRole
  meetingId: number
  userId: number
  user: {
    id: number
    name: string
    email: string
  }
}

export interface AddParticipantRequest {
  meetingId: number
  userId: number
  role?: ParticipantRole
}

export interface RemoveParticipantRequest {
  meetingId: number
  userId: number
}
