"use client";

import { useState, useEffect } from "react";

export function UserPresenceBadge({ userId, className = "" }) {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/users/presence");
        if (res.ok) {
          const { users } = await res.json();
          const user = users.find((u) => u.id === userId);
          if (user) {
            const lastSeen = user.lastSeenAt ? new Date(user.lastSeenAt).getTime() : 0;
            setIsOnline(Date.now() - lastSeen < 60000);
          }
        }
      } catch {}
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      } ${className}`}
      title={isOnline ? "Online" : "Offline"}
    />
  );
}
