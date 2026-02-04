import { z } from "zod";

export const roleSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    description: z.string().max(250, "Description must be less than 250 characters").optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
