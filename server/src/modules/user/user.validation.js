import { z } from 'zod';

/**
 * Schema for updating user profile
 */
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string()
      .max(100, 'Name must not exceed 100 characters')
      .optional(),

    bio: z.string()
      .max(500, 'Bio must not exceed 500 characters')
      .optional(),

    location: z.string()
      .max(100, 'Location must not exceed 100 characters')
      .optional(),

    experienceYears: z.number()
      .min(0, 'Experience years cannot be negative')
      .max(70, 'Experience years cannot exceed 70')
      .int()
      .optional(),

    skills: z.array(z.string().max(50))
      .max(20, 'Maximum 20 skills allowed')
      .optional(),

    education: z.array(
      z.object({
        institution: z.string().max(150).optional(),
        degree: z.string().max(100).optional(),
        startYear: z.number().int().min(1900).max(2100).optional(),
        endYear: z.number().int().min(1900).max(2100).optional()
      })
    ).optional(),

    picture: z.string().url('Picture must be a valid URL').optional(),
    
    settings: z.object({
      emailNotifications: z.boolean().optional(),
      soundEnabled: z.boolean().optional()
    }).optional()
  })
});


