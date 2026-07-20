"use client";

import { useActionState, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser, deleteUser, resetPassword } from "@/actions/users";
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
  Pencil,
  Save,
  X,
  KeyRound,
  Filter,
} from "lucide-react";
import { format } from "date-fns";

const TEAM_OPTIONS = [
  { value: "", label: "None" },
  { value: "sales", label: "Sales" },
  { value: "tech", label: "Tech" },
  { value: "hr", label: "HR" },
  { value: "ceo_office", label: "CEO Office" },
  { value: "admin_head", label: "Admin Head" },
];

const TEAM_LABELS = {
  sales: "Sales",
  tech: "Tech",
  hr: "HR",
  ceo_office: "CEO Office",
  admin_head: "Admin Head",
};

const TEAM_BADGE_CLASSES = {
  sales: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  tech: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  hr: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  ceo_office: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  admin_head: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

const ROLE_OPTIONS = [
  { value: "", label: "All Roles" },
  { value: "STAFF", label: "Staff" },
  { value: "SALES", label: "Sales Associate" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Administrator" },
];

const TEAM_FILTER_OPTIONS = [
  { value: "", label: "All Teams" },
  { value: "sales", label: "Sales" },
  { value: "tech", label: "Tech" },
  { value: "hr", label: "HR" },
  { value: "ceo_office", label: "CEO Office" },
  { value: "admin_head", label: "Admin Head" },
  { value: "__none__", label: "Unassigned" },
];

export function UserManagementClient({ initialUsers, currentUserId }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [state, action, isPending] = useActionState(createUser, undefined);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "STAFF", team: "", isTraining: false });
  const [saving, setSaving] = useState(false);
  const [resetPwUserId, setResetPwUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("User created successfully");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  const startEdit = useCallback((user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team || "",
      isTraining: user.isTraining || false,
    });
    setResetPwUserId(null);
    setNewPassword("");
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingUser(null);
    setEditForm({ name: "", email: "", role: "STAFF", team: "", isTraining: false });
    setResetPwUserId(null);
    setNewPassword("");
  }, []);

  const handleSave = async () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      const res = await updateUser(editingUser.id, {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        team: editForm.team || null,
        isTraining: editForm.isTraining,
      });
      if (res.success) {
        toast.success("User updated");
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: editForm.name, email: editForm.email, role: editForm.role, team: editForm.team || null, isTraining: editForm.isTraining }
              : u
          )
        );
        cancelEdit();
      } else {
        toast.error(res.error || "Failed to update user");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success("User deleted");
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete user");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setResetting(true);
    try {
      const res = await resetPassword(resetPwUserId, newPassword);
      if (res.success) {
        toast.success("Password reset successfully");
        setResetPwUserId(null);
        setNewPassword("");
      } else {
        toast.error(res.error || "Failed to reset password");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  // Filtering
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = !teamFilter
      ? true
      : teamFilter === "__none__"
        ? !u.team
        : u.team === teamFilter;
    const matchesRole = !roleFilter ? true : u.role === roleFilter;
    return matchesSearch && matchesTeam && matchesRole;
  });

  // Team counts
  const teamCounts = {};
  for (const u of users) {
    const t = u.team || "__none__";
    teamCounts[t] = (teamCounts[t] || 0) + 1;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* User List Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search + Filters */}
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent border-none outline-none w-full text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="input text-sm py-1.5 w-auto"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              {TEAM_FILTER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              className="input text-sm py-1.5 w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {(teamFilter || roleFilter) && (
              <button
                onClick={() => { setTeamFilter(""); setRoleFilter(""); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Team Count Summary */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setTeamFilter(""); setRoleFilter(""); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !teamFilter && !roleFilter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All ({users.length})
          </button>
          {TEAM_FILTER_OPTIONS.filter((o) => o.value && o.value !== "__none__").map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setTeamFilter(opt.value); setRoleFilter(""); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                teamFilter === opt.value
                  ? `${TEAM_BADGE_CLASSES[opt.value]} ring-1 ring-current`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt.label} ({teamCounts[opt.value] || 0})
            </button>
          ))}
          <button
            onClick={() => { setTeamFilter("__none__"); setRoleFilter(""); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              teamFilter === "__none__"
                ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 ring-1 ring-current"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Unassigned ({teamCounts["__none__"] || 0})
          </button>
        </div>

        {/* User Table */}
        <div className="card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Team</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Created</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const isSelf = user.id === currentUserId;
                const isEditing = editingUser?.id === user.id;
                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isEditing
                        ? "bg-primary/5 ring-1 ring-inset ring-primary/20"
                        : "hover:bg-muted/20"
                    }`}
                  >
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
                    <td className="px-6 py-4">
                      {user.team ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${TEAM_BADGE_CLASSES[user.team] || ""}`}>
                          {TEAM_LABELS[user.team] || user.team}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(user)}
                          className="p-2 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                          title="Edit user"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {!isSelf && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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

      {/* Right Panel — Create or Edit */}
      <div className="space-y-6">
        {editingUser ? (
          /* ── Edit Mode ── */
          <div className="card p-6 border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Pencil className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold">Edit: {editingUser.name}</h2>
              </div>
              <button
                onClick={cancelEdit}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    className="input pl-10"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    className="input pl-10"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">System Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    className="input pl-10 appearance-none bg-background"
                    value={editForm.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                    disabled={editingUser.id === currentUserId}
                  >
                    <option value="STAFF">Staff Member</option>
                    <option value="SALES">Sales Associate</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
                {editingUser.id === currentUserId && (
                  <p className="text-xs text-muted-foreground">Cannot change your own role.</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Team (for EOD Reports)</label>
                <select
                  className="input appearance-none bg-background"
                  value={editForm.team}
                  onChange={(e) => setEditForm((f) => ({ ...f, team: e.target.value }))}
                >
                  {TEAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  id="editIsTraining"
                  type="checkbox"
                  checked={editForm.isTraining}
                  onChange={(e) => setEditForm((f) => ({ ...f, isTraining: e.target.checked }))}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                />
                <label htmlFor="editIsTraining" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  In Training BDA (Trainee)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2.5 rounded-xl font-medium border border-border hover:bg-muted transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Password Reset */}
            <div className="mt-6 pt-6 border-t border-border">
              {resetPwUserId === editingUser.id ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <KeyRound className="h-4 w-4" />
                    Reset Password
                  </div>
                  <input
                    type="password"
                    placeholder="New password (min 6 chars)"
                    className="input w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetPassword}
                      disabled={resetting}
                      className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50"
                    >
                      {resetting ? <Loader2 className="h-3 w-3 animate-spin" /> : <KeyRound className="h-3 w-3" />}
                      Reset
                    </button>
                    <button
                      onClick={() => { setResetPwUserId(null); setNewPassword(""); }}
                      className="px-3 py-2 rounded-xl text-sm font-medium border border-border hover:bg-muted transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setResetPwUserId(editingUser.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <KeyRound className="h-4 w-4" />
                  Reset Password
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Create Mode ── */
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Team (for EOD Reports)</label>
                <select name="team" className="input appearance-none bg-background">
                  {TEAM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
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
        )}

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
