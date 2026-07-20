"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { login } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(login, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success("Login successful");
      router.refresh();
      const isAdminish = ["ADMIN", "MANAGER"].includes(state.role);
      router.push(isAdminish ? "/students" : "/eod");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md card p-8 shadow-2xl border-3 border-primary rounded-3xl">
        
        {/* Header */}
        <div className="text-center mb-8 flex items-center justify-center">
         <Logo/>
        </div>

        {/* Form */}
        <form action={action} className="space-y-5">
          <div className="space-y-4">
            
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="input pl-10"
              />
              {state?.errors?.email && (
                <p className="text-xs text-red-500 mt-1">{state.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="input pl-10"
              />
              {state?.errors?.password && (
                <p className="text-xs text-red-500 mt-1">{state.errors.password}</p>
              )}
            </div>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center px-4 py-2.5 rounded-2xl hover:scale-105 hover:bg-primary/80 bg-primary text-primary-foreground transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Authenticating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}