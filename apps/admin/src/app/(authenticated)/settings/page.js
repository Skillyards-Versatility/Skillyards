import { getSession } from "@/lib/auth";
import { getSettings } from "@/actions/settings";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const settings = await getSettings();

  return <SettingsClient initialSettings={settings} />;
}
