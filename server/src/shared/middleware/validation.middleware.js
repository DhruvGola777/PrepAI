import { ZodError } from "zod";
import ValidationError from '../errors/ValidationError.js';

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formatted = result.error.flatten();
    return next(new ValidationError('Validation failed', formatted.fieldErrors));
  }

  req.body = result.data;
  next();
};
