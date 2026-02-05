import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),
    firstLastname: z
      .string()
      .min(1, "First lastname is required")
      .max(100, "First lastname must be at most 100 characters long"),
    secondLastname: z.string().max(100, "Second lastname must be at most 100 characters long").optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().max(20, "Phone number must be at most 20 characters long").optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[$%&@]/, "Password must contain at least one special character ($, %, &, @)")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (!!data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type UserFormValues = z.infer<typeof userSchema>;
