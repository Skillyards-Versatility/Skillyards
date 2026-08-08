import { Users, CreditCard, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { LatestStudentsTable } from "@/components/dashboard/LatestStudentsTable";

export const dynamic = "force-dynamic";

import { API } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth";

async function getDashboardData(enrolledIn, startDate, endDate, laptopOpted, limit = 10, offset = 0) {
  const headers = await getAuthHeaders();
  
  let latestUrl = `${API}/api/students?limit=${limit}&offset=${offset}&enrolledIn=${enrolledIn}`;
  if (enrolledIn === "custom" && startDate) {
    latestUrl += `&startDate=${startDate}`;
    if (endDate) {
      latestUrl += `&endDate=${endDate}`;
    }
  }
  if (laptopOpted !== "all") {
    latestUrl += `&laptopOpted=${laptopOpted === "opted"}`;
  }

  const [statsRes, outstandingRes, latestRes] = await Promise.all([
    fetch(`${API}/api/students/stats`, { headers, next: { revalidate: 600, tags: ['students'] } }),
    fetch(`${API}/api/students?limit=5`, { headers, next: { revalidate: 600, tags: ['students'] } }),
    fetch(latestUrl, { headers, next: { revalidate: 600, tags: ['students'] } })
  ]);
  
  const stats = statsRes.ok ? await statsRes.json() : { totalStudents: 0, totalCollected: 0, totalPending: 0 };
  const outstanding = outstandingRes.ok ? await outstandingRes.json() : [];
  const latestStudents = latestRes.ok ? await latestRes.json() : [];

  return { stats, outstanding, latestStudents };
}

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const enrolledIn = params.enrolledIn || "current";
  const startDate = params.startDate || "";
  const endDate = params.endDate || "";
  const laptopOpted = params.laptopOpted || "all";
  const page = parseInt(params.latestPage || "1");
  const limit = 5;
  const offset = (page - 1) * limit;
  
  const { stats: dashStats, outstanding, latestStudents } = await getDashboardData(enrolledIn, startDate, endDate, laptopOpted, limit + 1, offset);

  const hasNextPage = latestStudents.length > limit;
  const slicedStudents = latestStudents.slice(0, limit);

  const stats = [
    { title: "Total Students", value: dashStats.totalStudents, icon: Users },
    { title: "Total Collected", value: `₹${dashStats.totalCollected.toLocaleString()}`, icon: CreditCard },
    { title: "Total Pending", value: `₹${dashStats.totalPending.toLocaleString()}`, icon: Activity },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">System metrics and fee collection overview.</p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="space-y-6 sm:space-y-8">
        <RecentTransactionsTable students={outstanding} />
        <LatestStudentsTable 
          students={slicedStudents} 
          enrolledIn={enrolledIn} 
          laptopOpted={laptopOpted}
          initialStartDate={startDate}
          initialEndDate={endDate}
          currentPage={page}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  );
}
