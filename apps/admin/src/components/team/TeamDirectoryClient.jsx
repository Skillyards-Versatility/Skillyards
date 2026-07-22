"use client";

import { useState, useEffect } from "react";
import { Users as UsersIcon, Search } from "lucide-react";
import { getTeamStatuses } from "@/actions/status";

export function TeamDirectoryClient({ userRole }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getTeamStatuses();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            <UsersIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Team Directory</h1>
            <p className="text-sm text-muted-foreground mt-1">
              See what your teammates are up to.
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search team..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 h-9 pl-9 pr-3 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const initials = user.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
            const isOnline = true; // In a real app, this might rely on websockets or recent activity

            return (
              <div
                key={user.id}
                className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg overflow-hidden border border-primary/20">
                    {user.profileImageKey ? (
                      <img src={`/api/files/${user.profileImageKey}`} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  {/* Status dot / Emoji badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background flex items-center justify-center border shadow-sm">
                    {user.statusEmoji ? (
                      <span className="text-xs">{user.statusEmoji}</span>
                    ) : (
                      <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-muted-foreground/50'}`} />
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm truncate text-foreground flex items-center gap-2">
                    {user.name}
                  </h3>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.role} {user.team ? `• ${user.team}` : ''}
                  </div>
                  {user.statusText && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-foreground truncate max-w-full">
                      <span className="truncate">{user.statusText}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
