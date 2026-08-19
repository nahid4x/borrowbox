"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GlassInput, FormField } from "@/components/ui/glass-input";
export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        setSubmitting(false);
        if (result?.error) {
            setError("Incorrect email or password.");
            return;
        }
        router.push(searchParams.get("callbackUrl") || "/dashboard");
        router.refresh();
    }
    return (<div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-mid">Log in to continue borrowing and lending.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FormField label="University email" htmlFor="email">
          <GlassInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@diu.edu.bd"/>
        </FormField>
        <FormField label="Password" htmlFor="password">
          <GlassInput id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"/>
        </FormField>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <Button type="submit" variant="primary" size="default" className="w-full max-w-sm" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 max-w-sm text-center text-sm text-mid">
        New to BorrowBox?{" "}
        <Link href="/register" className="font-medium text-[var(--color-accent-light)] hover:underline">
          Create an account
        </Link>
      </p>
    </div>);
}