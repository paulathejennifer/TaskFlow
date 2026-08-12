"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthCard } from "@/app/components/shared/auth-card";
import { AuthLayout } from "@/app/components/shared/auth-layout";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/hooks/use-auth";

const DEMO_EMAIL = "testuser2@example.com";
const DEMO_PASSWORD = "Test1234!";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function useDemoCredentials() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await login({
        email,
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to log in.",
      );
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        description="Log in to your TaskFlow account"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger"
            >
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-text-primary"
            >
              Email
            </label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-text-primary"
            >
              Password
            </label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Demo access
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Use the demo account to explore the application.
              </p>
            </div>

            <button
              type="button"
              onClick={useDemoCredentials}
              className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
            >
              Use demo account
            </button>
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <p className="text-text-muted">
              Email:{" "}
              <span className="font-medium text-text-primary">
                {DEMO_EMAIL}
              </span>
            </p>

            <p className="text-text-muted">
              Password:{" "}
              <span className="font-medium text-text-primary">
                {DEMO_PASSWORD}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
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