"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUser, deleteUser } from "@/actions/users";
import { toast } from "sonner";
import {
  Users,
  UserPlus,
  Mail,
  Lock,
  Shield,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";
import { format } from "date-fns";

export function UserManagementClient({ initialUsers }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [state, action, isPending] = useActionState(createUser, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success("User created successfully");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success("User deleted");
        setUsers(users.filter(u => u.id !== id));
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch(err) {
      toast.error(err?.message || "Failed to load receipt");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* User List Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="bg-transparent border-none outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        user.role === 'MANAGER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {user.role}
                      </span>
                      {user.isTraining && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                          Trainee
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add User Section */}
      <div className="space-y-6">
        <div className="card p-6 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <UserPlus className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">New Staff Member</h2>
          </div>

          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  name="name"
                  type="text" 
                  placeholder="John Doe" 
                  className="input pl-10" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  name="email"
                  type="email" 
                  placeholder="john@skillyards.com" 
                  className="input pl-10" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Initial Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input 
                  name="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="input pl-10" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">System Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <select name="role" className="input pl-10 appearance-none bg-background">
                  <option value="STAFF">Staff Member</option>
                  <option value="SALES">Sales Associate</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1">
              <input 
                id="isTraining"
                name="isTraining"
                type="checkbox" 
                value="true"
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer" 
              />
              <label htmlFor="isTraining" className="text-sm font-medium text-foreground cursor-pointer select-none">
                In Training BDA (Trainee)
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create User Account
            </button>
          </form>
        </div>

        <div className="card p-6 bg-muted/30">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Security Notice</h3>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
            <li>New users should change their password upon first login.</li>
            <li>Administrator roles have full access to database schema and settings.</li>
            <li>Session tokens expire after 7 days of inactivity.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
