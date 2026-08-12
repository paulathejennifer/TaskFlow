import Link from "next/link";

import { AuthCard } from "@/app/components/shared/auth-card";
import { AuthLayout } from "@/app/components/shared/auth-layout";
import { Button } from "@/app/components/ui/button";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Log in to your TaskFlow account"
      >
        <form className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-text-primary"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-text-primary"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="pt-2">
            <Button type="submit">
              Log in
            </Button>
          </div>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-text-muted">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Create one
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}