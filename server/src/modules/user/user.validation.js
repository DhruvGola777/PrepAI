import Joi from 'joi';

/**
 * Schema for updating user profile
 */
export const updateUserSchema = Joi.object({
  name: Joi.string()
    .optional()
    .trim()
    .max(100)
    .messages({
      'string.max': 'Name must not exceed 100 characters'
    }),

  bio: Joi.string()
    .optional()
    .trim()
    .max(500)
    .messages({
      'string.max': 'Bio must not exceed 500 characters'
    }),

  location: Joi.string()
    .optional()
    .trim()
    .max(100)
    .messages({
      'string.max': 'Location must not exceed 100 characters'
    }),

  experienceYears: Joi.number()
    .optional()
    .min(0)
    .max(70)
    .integer()
    .messages({
      'number.min': 'Experience years cannot be negative',
      'number.max': 'Experience years cannot exceed 70'
    }),

  skills: Joi.array()
    .optional()
    .items(Joi.string().trim().max(50))
    .max(20)
    .messages({
      'array.max': 'Maximum 20 skills allowed'
    }),

  education: Joi.array()
    .optional()
    .items(
      Joi.object({
        institution: Joi.string().trim().max(150),
        degree: Joi.string().trim().max(100),
        startYear: Joi.number().integer().min(1900).max(2100),
        endYear: Joi.number().integer().min(1900).max(2100)
      })
    )
    .messages({
      'object.unknown': 'Education fields are invalid'
    }),

  picture: Joi.string()
    .optional()
    .uri()
    .messages({
      'string.uri': 'Picture must be a valid URL'
    })
})
.unknown(false)
.messages({
  'object.unknown': 'Invalid fields provided'
});

