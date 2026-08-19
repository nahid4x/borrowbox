import Link from "next/link";
import { ArrowRight, ShieldCheck, Clock3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { prisma } from "@/lib/prisma";
export default async function LandingPage() {
    // Real counts, not placeholder numbers — pulled live so the landing page
    // never shows a fabricated stat.
    const [totalItems, totalStudents, totalReturned] = await Promise.all([
        prisma.item.count(),
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.borrowRequest.count({ where: { status: "RETURNED" } }),
    ]);
    return (<div className="min-h-screen">
      <header className="sticky top-4 z-20 mx-4 lg:mx-auto lg:max-w-5xl">
        <div className="glass-surface flex items-center gap-3 rounded-[var(--radius-pill)] px-4 py-2.5">
          <div className="mark flex items-center gap-2.5">
            <div className="spinner">
              <div /><div /><div /><div /><div /><div />
            </div>
            <span className="text-lg font-bold tracking-tight">BorrowBox</span>
          </div>
          <nav className="ml-auto hidden items-center gap-6 text-sm font-medium text-mid md:flex">
            <a href="#how" className="hover:text-[var(--color-text-hi)]">How it works</a>
          </nav>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 pb-20 pt-20 md:pt-28">
        <div className="animate-fade-in-up text-center">
          <span className="inline-block rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-glass)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-accent-light)]">
            Built for campus
          </span>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            The calculator in your bag could be someone&apos;s deadline.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base text-mid">
            List the gear you&apos;re not using. Borrow what you need for one assignment,
            not one semester. Every request tracked from ask to return.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/register">
                Get started <ArrowRight className="h-4 w-4"/>
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <GlassCard>
            <p className="text-3xl font-bold tracking-tight">{totalItems}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-low">items listed</p>
          </GlassCard>
          <GlassCard>
            <p className="text-3xl font-bold tracking-tight">{totalStudents}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-low">students on BorrowBox</p>
          </GlassCard>
          <GlassCard>
            <p className="text-3xl font-bold tracking-tight">{totalReturned}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-low">items returned safely</p>
          </GlassCard>
        </div>
      </section>

      <section id="how" className="border-y border-[var(--color-border)] bg-[var(--color-bg-1)]/40 py-16">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-bold tracking-tight">How BorrowBox works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
            { icon: Users, title: "List or find", body: "Post something you own, or search what your classmates have made available." },
            { icon: Clock3, title: "Request & agree", body: "Send a borrow request. The owner approves and sets expectations for return." },
            { icon: ShieldCheck, title: "Borrow safely", body: "Every handoff is logged — request, approval, borrowed, returned — start to finish." },
        ].map(({ icon: Icon, title, body }) => (<GlassCard key={title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]">
                  <Icon className="h-5 w-5"/>
</div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm text-mid">{body}</p>
              </GlassCard>))}
          </div>
        </div>
      </section>

 <footer className="py-8">
        <div className="mx-auto max-w-5xl px-6 text-center text-sm text-low">
          © 2026 BorrowBox · Designed &amp; Developed by{" "}
          <a href="https://aboutnahid.vercel.app" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-accent-light)] hover:opacity-80">
            Nahid
          </a>
          .
        </div>
      </footer>
    </div>);
}