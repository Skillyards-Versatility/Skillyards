import { getProfile } from "@/actions/profile";
import { ProfileClient } from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const result = await getProfile();

  if (!result.success) {
    return (
      <div className="card p-12 text-center text-muted-foreground">
        {result.error || "Could not load profile"}
      </div>
    );
  }

  return <ProfileClient user={result.user} />;
}
