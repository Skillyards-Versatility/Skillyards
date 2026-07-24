import { z } from "zod";

export const createBatchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Batch name is required")
    .max(100, "Batch name must be at most 100 characters"),
  courseName: z
    .string()
    .trim()
    .min(1, "Course name is required")
    .max(100, "Course name must be at most 100 characters"),
  description: z.string().trim().optional(),
  startDate: z.string().optional(),
  status: z.enum(["active", "completed", "upcoming"]).default("active"),
});

export function validateCreateBatch(data) {
  return createBatchSchema.safeParse(data);
}
