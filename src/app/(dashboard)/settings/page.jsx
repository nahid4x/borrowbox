import { ShieldCheck, LogOut, Info, Code2, LifeBuoy, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { GlassCard } from "@/components/ui/glass-card";
import { SignOutButton } from "@/components/shared/sign-out-button";

export default async function SettingsPage() {
  const session = await auth();
  const user = session.user;
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-mid">Account and session information.</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[var(--color-accent-light)]" />
          <div>
            <p className="text-sm font-medium">Account role</p>
            <p className="text-sm text-mid">
              {user.role === "ADMIN" ? "Administrator" : "Student"} - signed in as {user.email}
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-[var(--color-accent-light)]" />
          <div>
            <p className="text-sm font-medium">About BorrowBox</p>
            <p className="text-sm text-mid">
              BorrowBox is a modern campus lending platform that makes it easy to borrow, lend, and manage shared resources across the university.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <Code2 className="h-5 w-5 text-[var(--color-accent-light)]" />
       <div>
            <p className="text-sm font-medium">Developer info</p>
            <p className="text-sm text-mid">
              Designed &amp; Developed by{" "}
              <a href="https://aboutnahid.vercel.app" target="_blank" rel="noopener noreferrer" className="font-medium text-[var(--color-accent-light)] hover:opacity-80">
                Nahid
              </a>
            </p>
          </div>
            </div>
      </GlassCard>

      <GlassCard href="/help-support" className="flex items-start justify-between gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--color-accent-dim)]">
        <div className="flex items-start gap-3">
          <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent-light)]" />
          <div>
            <p className="text-sm font-medium">Help &amp; Support</p>
            <p className="text-sm text-mid">Report issues, bugs, inappropriate content, scams, or request assistance from the BorrowBox team.</p>
          </div>
        </div>
        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-low" />
      </GlassCard>

      <GlassCard className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <LogOut className="h-5 w-5 text-[var(--color-danger)]" />
          <div>
            <p className="text-sm font-medium">Log out</p>
            <p className="text-sm text-mid">End your current session on this device.</p>
          </div>
        </div>
        <SignOutButton />
      </GlassCard>
    </div>
  );
}