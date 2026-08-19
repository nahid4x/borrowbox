import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquareWarning } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { humanizeEnum, cn } from "@/lib/utils";

const STATUSES = ["ALL", "RECEIVED", "UNDER_REVIEW", "NEED_MORE_INFO", "RESOLVED", "CLOSED", "REJECTED"];

export default async function AdminReportsPage({ searchParams }) {
  const session = await auth();
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { status: statusParam } = await searchParams;
  const status = STATUSES.includes(statusParam?.toUpperCase()) ? statusParam.toUpperCase() : "ALL";

  const reports = await prisma.report.findMany({
    where: status !== "ALL" ? { status } : {},
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquareWarning className="h-5 w-5 text-[var(--color-accent-light)]" />
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/reports${s !== "ALL" ? `?status=${s}` : ""}`}
            className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors", status === s
                ? "bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                : "bg-[var(--color-glass)] text-mid hover:text-[var(--color-text-hi)]")}
          >
            {s === "ALL" ? "All" : humanizeEnum(s)}
          </Link>
        ))}
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={MessageSquareWarning} title="No reports" description="Reports submitted by users will show up here." />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Link
              key={r.id}
              href={`/admin/reports/${r.id}`}
              className="glass-surface flex flex-col gap-2 rounded-[var(--radius-xl)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--color-accent-dim)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono-ui text-xs text-low">{r.referenceCode}</p>
                <p className="text-sm font-medium">{humanizeEnum(r.category)}</p>
                <p className="text-xs text-low">{r.user.name} · {r.createdAt.toLocaleDateString()}</p>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}