"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthCard } from "@/app/components/shared/auth-card";
import { AuthLayout } from "@/app/components/shared/auth-layout";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/hooks/use-auth";

const DEMO_EMAIL = "testuser2@example.com";
const DEMO_PASSWORD = "Test1234!";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await register({
        full_name: fullName,
        email,
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account.",
      );
    }
  }

  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        description="Get started with TaskFlow"
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
              htmlFor="full-name"
              className="text-sm font-medium text-text-primary"
            >
              Full name
            </label>

            <Input
              id="full-name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
            />
          </div>

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
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <p className="text-xs text-text-muted">
              Use a password that meets the application's password
              requirements.
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-text-primary">
            Need to preview the app?
          </p>

          <p className="mt-1 text-xs leading-5 text-text-muted">
            You can use the demo account below from the Login page.
            This is provided for evaluation and demonstration purposes.
          </p>

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

          <Link
            href="/login"
            className="mt-3 inline-block text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Go to demo login →
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-text-muted">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Log in
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}