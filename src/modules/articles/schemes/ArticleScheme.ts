import { z } from "zod";

export const articleSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    description: z.string().max(250, "Description must be less than 250 characters").optional(),
    barcode: z.string().min(1, "Barcode is required").max(50, "Barcode must be less than 50 characters"),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
