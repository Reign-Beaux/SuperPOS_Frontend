import { z } from "zod";

export const customerSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    firstLastname: z.string().min(1, "First Lastname is required").max(100, "First Lastname must be less than 100 characters"),
    secondLastname: z.string().max(100, "Second Lastname must be less than 100 characters").optional(),
    email: z.string().email("Invalid email address").optional().or(z.literal('')),
    phone: z.string().optional(),
    birthDate: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;
