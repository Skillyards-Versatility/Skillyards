"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { crmApi } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [crmRoles, setCrmRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await crmApi.getMe();
      setUser(res.user);
      setCrmRoles(res.crmRoles || []);
      setError(null);
    } catch (err) {
      console.warn("CRM auth check failed:", err.message);
      setUser(null);
      setCrmRoles([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        crmRoles,
        loading,
        error,
        isAuthenticated: !!user,
        refreshAuth: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
