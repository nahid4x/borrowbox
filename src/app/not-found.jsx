import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
export default function NotFound() {
    return (<div className="flex min-h-screen items-center justify-center px-6">
      <GlassCard className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-glass-hi)]">
          <PackageSearch className="h-5 w-5 text-low"/>
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 text-sm text-mid">
          The page you&apos;re looking for doesn&apos;t exist, or may have moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </GlassCard>
    </div>);
}
