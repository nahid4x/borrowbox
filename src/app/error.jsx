"use client";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
export default function Error({ error, reset, }) {
    useEffect(() => {
        // In production this would go to an error-reporting service; logging
        // to the console keeps the sandbox build dependency-free.
        console.error(error);
    }, [error]);
    return (<div className="flex min-h-screen items-center justify-center px-6">
      <GlassCard className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-danger-dim)]">
          <AlertTriangle className="h-5 w-5 text-[var(--color-danger)]"/>
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-mid">
          BorrowBox hit an unexpected error. You can try again, or head back to your dashboard.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <Button asChild variant="secondary">
            <a href="/dashboard">Back to dashboard</a>
          </Button>
        </div>
      </GlassCard>
    </div>);
}
