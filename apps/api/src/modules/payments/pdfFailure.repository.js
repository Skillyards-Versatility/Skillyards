import { pdfFailures } from "@repo/db";

export async function logPdfFailure(db, data) {
  return db.insert(pdfFailures).values({
    paymentId: data.paymentId,
    errorMessage: data.errorMessage,
  });
}
