
import Link from "next/link";
import { FileText } from "lucide-react";
import { HelpSupportForm } from "@/components/help/help-support-form";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { humanizeEnum } from "@/lib/utils";

export default async function HelpSupportPage() {
  const session = await auth();
  const reports = await prisma.report.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help &amp; Support</h1>
        <p className="text-sm text-mid">
          Need help? Report problems, unexpected behavior, suspicious activity, or send feedback to improve BorrowBox.
        </p>
      </div>
      <HelpSupportForm userEmail={session.user.email} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Reports</h2>
        {reports.length === 0 ? (
          <EmptyState icon={FileText} title="No reports yet" description="Reports you submit will show up here." />
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <Link
                key={r.id}
                href={`/help-support/${r.id}`}
                className="glass-surface flex flex-col gap-2 rounded-[var(--radius-xl)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--color-accent-dim)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-mono-ui text-xs text-low">{r.referenceCode}</p>
                  <p className="text-sm font-medium">{humanizeEnum(r.category)}</p>
                 <p className="text-xs text-low">{r.createdAt.toLocaleDateString()}</p>
                </div>
                <StatusBadge status={r.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}