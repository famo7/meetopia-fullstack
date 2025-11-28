import { z } from 'zod';

export const CreateMeetingSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),

  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .default(''),

  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
}).superRefine((data: any, ctx: any) => {
  // Parse start time
  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (isNaN(startTime.getTime())) {
    ctx.addIssue({
      code: 'custom',
      path: ['startTime'],
      message: 'Invalid start time format'
    });
    return;
  }

  if (isNaN(endTime.getTime())) {
    ctx.addIssue({
      code: 'custom',
      path: ['endTime'],
      message: 'Invalid end time format'
    });
    return;
  }

  const now = new Date();
  const minTime = new Date(now.getTime() + 5 * 60 * 1000);
  if (startTime < minTime) {
    ctx.addIssue({
      code: 'custom',
      path: ['startTime'],
      message: 'Meeting must be scheduled at least 5 minutes from now'
    });
  }

  if (endTime <= startTime) {
    ctx.addIssue({
      code: 'custom',
      path: ['endTime'],
      message: 'End time must be after start time'
    });
  }
});

export const UpdateMeetingSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),

  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),

  startTime: z.coerce.date()
    .optional(),

  endTime: z.coerce.date()
    .optional(),

  status: z.enum(['SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED'])
    .optional()
});

export type CreateMeetingRequest = z.infer<typeof CreateMeetingSchema>;
export type UpdateMeetingRequest = z.infer<typeof UpdateMeetingSchema>;