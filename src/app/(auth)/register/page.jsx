"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { GlassInput, FormField } from "@/components/ui/glass-input";
export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [studentId, setStudentId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, studentId, password }),
        });
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            setError(body?.error ?? "Something went wrong. Please try again.");
            setSubmitting(false);
            return;
        }
        // Registration succeeded — sign the student straight in.
        const result = await signIn("credentials", { email, password, redirect: false });
        setSubmitting(false);
        if (result?.error) {
            router.push("/login");
            return;
        }
        router.push("/dashboard");
        router.refresh();
    }
    return (<div>
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-mid">Join your campus lending community.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <FormField label="Full name" htmlFor="name">
          <GlassInput id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="MD. Asif Shikdar Nahid"/>
        </FormField>
        <FormField label="University email" htmlFor="email" hint="Must end in @diu.edu.bd">
          <GlassInput id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@diu.edu.bd"/>
        </FormField>
        <FormField label="Student ID" htmlFor="studentId">
          <GlassInput id="studentId" required value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 241-35-424"/>
        </FormField>
        <FormField label="Password" htmlFor="password" hint="At least 8 characters">
          <GlassInput id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters"/>
        </FormField>

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

        <Button type="submit" variant="primary" size="default" className="w-full max-w-sm" disabled={submitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 max-w-sm text-center text-sm text-mid">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[var(--color-accent-light)] hover:underline">
          Log in
        </Link>
      </p>
    </div>);
}