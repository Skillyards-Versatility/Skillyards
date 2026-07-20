"use client";

import { useActionState } from "react";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { forgotPassword } from "@/actions/auth";

export default function ForgotPasswordPage() {
  const [state, action, isPending] = useActionState(forgotPassword, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md card p-8 shadow-2xl border-3 border-primary rounded-3xl">

        <div className="text-center mb-8 flex items-center justify-center">
          <Logo />
        </div>

        {state?.success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              {state.message}
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold">Forgot your password?</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            <form action={action} className="space-y-5">
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

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-2xl hover:scale-105 hover:bg-primary/80 bg-primary text-primary-foreground transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
