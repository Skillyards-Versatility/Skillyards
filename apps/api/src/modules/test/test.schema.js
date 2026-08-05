import { z } from "zod";

export const HONEYPOT_FIELDS = ["website", "company"];

export const registerTestSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name is required')
      .max(50, 'Name must be less than 50 characters')
      .trim(),

    email: z
      .string()
      .email('Invalid email address')
      .toLowerCase()
      .trim(),

    phone: z
      .string()
      .transform((val) => val.replace(/\D/g, ''))
      .transform((val) => {
        if (val.length === 12 && val.startsWith("91")) {
          return val.slice(2);
        }
        return val;
      })
      .refine((val) => val.length === 10, {
        message: 'Invalid phone number',
      }),

    captchaToken: z.string().optional(),

    website: z.string().optional(),
    company: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const honeypotFilled = HONEYPOT_FIELDS.some(
      (field) => typeof data[field] === "string" && data[field].trim().length > 0
    );
    if (honeypotFilled) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["website"],
        message: "Invalid input",
      });
    }
  });