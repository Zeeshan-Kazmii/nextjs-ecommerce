import {z} from 'zod'

export const zSchema = z.object({
  name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long")
      .regex(/^[a-zA-Z\s]+$/,{ message: "Name can only contain letters and spaces" }),

  email: z.string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character"),
})
