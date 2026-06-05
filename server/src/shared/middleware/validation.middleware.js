import { ZodError } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const formatted = result.error.flatten();
    return res.status(400).json({
      message: "Validation failed",
      errors: formatted.fieldErrors,
    });
  }

  req.body = result.data;
  next();
};
