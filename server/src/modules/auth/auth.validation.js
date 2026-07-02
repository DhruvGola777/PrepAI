import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    username: z.string().min(3, { message: "Username must be at least 3 characters long" }),
    name: z.string().min(1, { message: "Name must contain at least 1 character" }).optional(),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
  })
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, { message: "Old password is required" }),
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters long" }),
  })
});

