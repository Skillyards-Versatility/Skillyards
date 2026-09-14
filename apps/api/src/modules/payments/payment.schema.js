import { z } from "zod";

export const PAYMENT_METHODS = ["cash", "upi", "bank"];

export const createPaymentSchema = z.object({
  amount: z.number().int().positive("Amount must be greater than 0"),

  method: z.enum(PAYMENT_METHODS).default("cash"),

  note: z.string().trim().max(500, "Note too long").optional(),
});

export function validateCreatePayment(data) {
  return createPaymentSchema.safeParse(data);
}
