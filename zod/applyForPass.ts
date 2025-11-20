import { z } from 'zod';

export const passRequestSchema = z.object({
  passType: z.enum(['long', 'short']),
  reasonForExit: z.string().min(1, 'Reason for exit is required.').max(500, 'Reason too long.'),
  destination: z.string().min(1, 'Destination is required.').max(200),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid departure date.').refine((val) => new Date(val) >= new Date(), 'Departure date must be today or future.'),
  departureTime: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM).'),
  returnDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid return date.'),
  returnTime: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM).').optional(),
  emergencyContact: z.string().min(1, 'Emergency contact is required.').max(100),
  emergencyPhone: z.string().min(10, 'Phone must be at least 10 digits.').regex(/^\+?\d{10,15}$/, 'Invalid phone format.'),
  additionalNotes: z.string().max(1000, 'Notes too long.').optional(),
  parentNotification: z.string().optional(), // 'on' from checkbox
}).refine((data) => {
  if (data.passType === 'long') {
    return !!data.returnDate && new Date(data.returnDate) > new Date(data.departureDate);
  }
  return true;
}, {
  message: 'For long passes, return date must be after departure date.',
  path: ['returnDate'],
});