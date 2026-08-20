import { Users, CreditCard, Activity } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { LatestStudentsTable } from "@/components/dashboard/LatestStudentsTable";

import { RefreshButton } from "@/components/dashboard/RefreshButton";

export const dynamic = "force-dynamic";

import { API } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth";

async function getDashboardData(enrolledIn, startDate, endDate, laptopOpted, limit = 10, offset = 0) {
  try {
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
      fetch(`${API}/api/students/stats`, { headers, cache: "no-store" }),
      fetch(`${API}/api/students?limit=5`, { headers, cache: "no-store" }),
      fetch(latestUrl, { headers, cache: "no-store" })
    ]);

    if (!statsRes.ok || !outstandingRes.ok || !latestRes.ok) {
      return { error: true };
    }

    const stats = await statsRes.json();
    const outstanding = await outstandingRes.json();
    const latestStudents = await latestRes.json();

    return { stats, outstanding, latestStudents };
  } catch (err) {
    console.error("[ADMIN][ERROR] getDashboardData:", err.message);
    return { error: true };
  }
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
  
  const data = await getDashboardData(enrolledIn, startDate, endDate, laptopOpted, limit + 1, offset);
  const lastUpdated = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  if (data.error) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">System metrics and fee collection overview.</p>
          </div>
          <RefreshButton />
        </div>
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-8 rounded-xl flex flex-col items-center justify-center space-y-4">
          <Activity className="h-8 w-8" />
          <p className="font-semibold text-center">Failed to load dashboard data. The backend might be unreachable.</p>
          <RefreshButton className="bg-destructive/20 text-destructive hover:bg-destructive/30" />
        </div>
      </div>
    );
  }

  const { stats: dashStats, outstanding, latestStudents } = data;

  const hasNextPage = latestStudents.length > limit;
  const slicedStudents = latestStudents.slice(0, limit);

  const stats = [
    { title: "Total Students", value: dashStats.totalStudents, icon: Users },
    { title: "Total Collected", value: `₹${dashStats.totalCollected.toLocaleString()}`, icon: CreditCard },
    { title: "Total Pending", value: `₹${dashStats.totalPending.toLocaleString()}`, icon: Activity },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-3">
            Dashboard
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
              Updated {lastUpdated}
            </span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">System metrics and fee collection overview.</p>
        </div>
        <RefreshButton />
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
