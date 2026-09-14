import { redirect } from "next/navigation";
import TopicSelector from "@/components/testpage/TopicSelector";
import { Award, Shield } from "lucide-react";

export default async function TestStartPage({ searchParams }) {
  const params = await searchParams;
  const leadId = params?.leadId;

  if (!leadId) {
    redirect("/10-minutes-test");
  }

  let lead = null;

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${BASE_URL}/api/test/validate?leadId=${leadId}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      lead = data?.lead;
    }
  } catch (err) {
    console.error("Validation fetch failed:", err);
  }

  if (!lead) {
    redirect("/10-minutes-test");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">
            <Award size={14} />
            <span>Choose Your Challenge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-2">
            Select Topics
          </h1>
          <p className="text-muted-foreground text-sm">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">{lead.name}</span>!
            Pick the skills you want to test.
          </p>
        </div>

        <TopicSelector leadId={lead.id} />

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <Shield size={14} />
          <span>Your data is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
}
