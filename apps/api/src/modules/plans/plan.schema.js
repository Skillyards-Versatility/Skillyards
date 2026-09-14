import { z } from "zod";

export const PLAN_TYPES = ["full", "emi", "custom", "flexible"];

const installmentSchema = z.object({
  amount: z.number().int().positive("Amount must be greater than 0"),

  dueDate: z.string().min(1, "Due date is required"),
});

export const createPlanSchema = z
  .object({
    type: z.enum(PLAN_TYPES),

    totalAmount: z
      .number()
      .int()
      .positive("Total amount must be greater than 0"),

    installments: z.array(installmentSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const { type, installments, totalAmount } = data;

    if (["emi", "custom", "flexible"].includes(type)) {
      if (!installments || installments.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one installment is required",
          path: ["installments"],
        });
        return;
      }
    }

    if (type === "custom") {
      const sum = installments.reduce((acc, i) => acc + i.amount, 0);

      if (sum !== totalAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Installment sum must equal total amount",
          path: ["installments"],
        });
      }
    }

    if (type === "flexible") {
      const sum = installments.reduce((acc, i) => acc + i.amount, 0);

      if (sum > totalAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Installment sum cannot exceed total amount",
          path: ["installments"],
        });
      }
    }
  });

export function validateCreatePlan(data) {
  return createPlanSchema.safeParse(data);
}
