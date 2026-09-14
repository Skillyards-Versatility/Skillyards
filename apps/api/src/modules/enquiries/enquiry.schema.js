//this file is for request validation
import { z } from "zod";

export const createEnquirySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),

  lastName: z.string().max(100).optional(),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  phone: z
    .string()
    .regex(/^[0-9+\-\s()]*$/, "Invalid phone number")
    .max(20)
    .optional(),

  message: z.string().min(1, "Message is required").max(1000),

  captchaToken: z.string().min(1, "Captcha token is required"),
});

export function validateEnquiry(data) {
  return createEnquirySchema.safeParse(data);
}
