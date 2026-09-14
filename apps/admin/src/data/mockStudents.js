export const mockStudents = [
  {
    id: "1",
    name: "Rajat Kumar",
    course: "Full Stack Web Development",
    status: "Active",
    baseFee: 40000,
    scholarship: 5000,
    transactions: [
      {
        id: "TXN1029",
        amount: 15000,
        mode: "UPI",
        reference: "UPI/330/HDFC",
        date: "Oct 24, 2026",
        receiptId: "RC-001",
      },
    ],
  },
  {
    id: "2",
    name: "Sneha Patil",
    course: "Data Science Masters",
    status: "Active",
    baseFee: 50000,
    scholarship: 8000,
    transactions: [
      {
        id: "TXN1027",
        amount: 20000,
        mode: "Bank Transfer",
        reference: "NEFT/2210/SBI",
        date: "Oct 20, 2026",
        receiptId: "RC-002",
      },
      {
        id: "TXN1030",
        amount: 10000,
        mode: "Cash",
        reference: "-",
        date: "Oct 25, 2026",
        receiptId: "RC-003",
      },
    ],
  },
  {
    id: "3",
    name: "Anil Desai",
    course: "UI/UX Design",
    status: "Completed",
    baseFee: 35000,
    scholarship: 0,
    transactions: [
      {
        id: "TXN1020",
        amount: 35000,
        mode: "UPI",
        reference: "UPI/120/ICICI",
        date: "Sep 15, 2026",
        receiptId: "RC-004",
      },
    ],
  },
];

/**
 * Dashboard-level aggregate data.
 * In production this would come from a /dashboard/stats API endpoint.
 */
export const dashboardStats = {
  totalStudents: "142",
  totalRevenue: "₹8,40,000",
  pendingFees: "₹65,000",
};

/**
 * Recent transactions shown on the dashboard.
 * In production this would come from a /transactions?limit=5 API endpoint.
 */
export const recentTransactions = [
  {
    id: "TXN1029",
    student: "Rahul Sharma",
    amount: "₹15,000",
    date: "Oct 24, 2026",
  },
  {
    id: "TXN1028",
    student: "Aditi Patil",
    amount: "₹8,000",
    date: "Oct 23, 2026",
  },
];

/**
 * Helper: look up a single student by ID.
 */
export function getStudentById(id) {
  return mockStudents.find((s) => s.id === id) || null;
}
