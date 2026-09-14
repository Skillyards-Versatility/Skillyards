import * as paymentRepo from "./payment.repository";
import * as studentRepo from "../students/student.repository";

export async function getStudentLedger(db, studentId, preStudent = null) {
  const [student, totalDue, totalPaid] = await Promise.all([
    preStudent
      ? Promise.resolve(preStudent)
      : studentRepo.getStudentById(db, studentId),
    paymentRepo.getTotalDueForStudent(db, studentId),
    paymentRepo.getTotalPaidForStudent(db, studentId),
  ]);

  const pending = Math.max(0, (totalDue || 0) - (totalPaid || 0));
  const credit = Math.max(0, (totalPaid || 0) - (totalDue || 0));

  return {
    studentName: student?.name,
    courseName: student?.courseName,
    totalDue: totalDue || 0,
    totalPaid: totalPaid || 0,
    pending,
    credit,
  };
}
