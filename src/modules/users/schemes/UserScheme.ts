import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),
  firstLastname: z.string().min(1, "First lastname is required").max(100, "First lastname must be at most 100 characters long"),
  secondLastname: z.string().max(100, "Second lastname must be at most 100 characters long").optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(20, "Phone number must be at most 20 characters long").optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
