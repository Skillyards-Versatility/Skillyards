import { redirect } from "next/navigation";
import { getUsers } from "@/actions/users";
import { getSession } from "@/lib/auth";
import { UserManagementClient } from "./UserManagementClient";

export default async function UsersPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const initialUsers = await getUsers();

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage staff access and roles for the Skillyards administration.</p>
        </div>
      </div>

      <UserManagementClient initialUsers={initialUsers} currentUserId={session.userId} />
    </div>
  );
}
