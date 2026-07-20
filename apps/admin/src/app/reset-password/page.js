"use client";

import { useActionState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { resetPassword } from "@/actions/auth";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, action, isPending] = useActionState(resetPassword, undefined);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md card p-8 shadow-2xl border-3 border-primary rounded-3xl text-center">
          <Logo />
          <h1 className="text-xl font-semibold mt-6">Invalid Reset Link</h1>
          <p className="text-sm text-muted-foreground mt-2">
            This password reset link is invalid or missing a token.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md card p-8 shadow-2xl border-3 border-primary rounded-3xl">

        <div className="text-center mb-8 flex items-center justify-center">
          <Logo />
        </div>

        {state?.success ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-semibold">Password Reset</h1>
            <p className="text-sm text-muted-foreground">
              Your password has been updated. You can now sign in.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-2xl hover:scale-105 hover:bg-primary/80 bg-primary text-primary-foreground transition-all text-sm font-medium"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold">Set New Password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a strong password for your account.
              </p>
            </div>

            <form action={action} className="space-y-5">
              <input type="hidden" name="token" value={token} />

              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    name="newPassword"
                    type="password"
                    placeholder="New password (min. 6 characters)"
                    required
                    minLength={6}
                    className="input pl-10"
                  />
                  {state?.errors?.newPassword && (
                    <p className="text-xs text-red-500 mt-1">{state.errors.newPassword}</p>
                  )}
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    className="input pl-10"
                  />
                  {state?.errors?.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{state.errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center px-4 py-2.5 rounded-2xl hover:scale-105 hover:bg-primary/80 bg-primary text-primary-foreground transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Resetting password...
                  </>
                ) : (
                  "Reset Password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
