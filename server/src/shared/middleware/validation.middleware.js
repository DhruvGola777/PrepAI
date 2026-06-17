import { ZodError } from "zod";
import ValidationError from '../errors/ValidationError.js';

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params
  });

  if (!result.success) {
    const formatted = result.error.flatten();
    return next(new ValidationError('Validation failed', formatted.fieldErrors));
  }

  // Update request objects with parsed/transformed data
  if (result.data.body) req.body = result.data.body;
  if (result.data.query) req.query = result.data.query;
  if (result.data.params) req.params = result.data.params;

  next();
};
