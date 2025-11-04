import type { User } from "./user";


export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "PARTICIPANT_ADDED"
  | "ACTION_ITEM_ASSIGNED"
  | "ACTION_ITEM_UPDATED"
  | "MEETING_UPDATED"
  | "MEETING_REMINDER";



export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  userId: number;
  relatedId?: number | null;
  relatedType?: string | null;
  user?: User;
}
