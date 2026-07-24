import { z } from 'zod';

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
            .optional(),

        email: z
            .string()
            .trim()
            .email("Invalid email")
            .optional(),
        
        courseName: z
            .string()
            .trim()
            .max(100, "Course name must be at most 100 characters")
            .optional(),

        batchId: z.string().uuid("Invalid batch ID").optional().nullable(),
        batchName: z.string().trim().optional().nullable(),

        totalFee: z
            .number()
            .int()
            .positive("Total fee must be a positive integer"),

        finalFee: z
            .number()
            .int()
            .positive("Final fee must be a positive integer"),
    })
    .refine((data) => data.finalFee <= data.totalFee, {
        message: "Final fee cannot exceed total fee",
        path: ["finalFee"],
    });

export function validateCreateStudent(data) {
    return createStudentSchema.safeParse(data);
}