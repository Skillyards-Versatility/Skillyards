import { z } from "zod";

export const createStudentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(100, "Name must be at most 100 characters"),

    phone: z
      .string()
      .trim()
      .max(10, "Phone number must be at most 10 digits")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),

    email: z
      .string()
      .trim()
      .email("Invalid email")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),

    courseName: z
      .string()
      .trim()
      .max(100, "Course name must be at most 100 characters")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),

    batchId: z
      .string()
      .uuid("Invalid batch ID")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),

    batchName: z
      .string()
      .trim()
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),

    assignedTo: z
      .string()
      .uuid("Invalid user ID")
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),

    totalFee: z.coerce
      .number()
      .int()
      .nonnegative("Total fee must be a non-negative integer"),

    finalFee: z.coerce
      .number()
      .int()
      .nonnegative("Final fee must be a non-negative integer"),

    laptopOpted: z.boolean().default(false),
    laptopOptedAt: z
      .union([z.string().datetime(), z.date()])
      .nullable()
      .optional()
      .transform((v) => (v ? (v instanceof Date ? v : new Date(v)) : null)),

    photoKey: z
      .string()
      .trim()
      .or(z.literal(""))
      .nullable()
      .optional()
      .transform((v) => (v ? v : null)),
  })
  .refine((data) => data.finalFee <= data.totalFee, {
    message: "Final fee cannot exceed total fee",
    path: ["finalFee"],
  });

export function validateCreateStudent(data) {
  return createStudentSchema.safeParse(data);
}
