import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/shared/status-badge";
import { ReportStatusForm } from "@/components/admin/report-status-form";
import { humanizeEnum } from "@/lib/utils";

export default async function AdminReportDetailPage({ params }) {
  const { id } = await params;
  const session = await auth();
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const report = await prisma.report.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true, studentId: true } } },
  });
  if (!report) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/admin/reports" className="flex items-center gap-1.5 text-sm text-mid hover:text-[var(--color-text-hi)]">
        <ArrowLeft className="h-4 w-4" /> Back to Reports
      </Link>

      <div className="glass-surface rounded-[var(--radius-xl)] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-xs text-low">{report.referenceCode}</p>
            <h1 className="mt-1 text-xl font-bold">{humanizeEnum(report.category)}</h1>
            <p className="mt-1 text-sm text-mid">
              {report.user.name} · {report.user.email}
            </p>
          </div>
          <StatusBadge status={report.status} />
        </div>

         <div className="mt-4">
     <p className="text-xs uppercase tracking-wide text-low">Submitted</p>
      <p className="mt-0.5 font-medium">{report.createdAt.toLocaleDateString()}</p>
     </div>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-low">Description</p>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-mid">{report.description}</p>
        </div>

        {report.attachments.length > 0 && (
          <div className="mt-6">
            <p className="text-xs uppercase tracking-wide text-low">Attachments</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.attachments.map((url) => {
                const isImage = /\.(png|jpe?g|webp)$/i.test(url);
                return (
                  <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="block">
                    {isImage ? (
                      <div className="relative h-16 w-16 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)]">
                        <Image src={url} alt="Attachment" fill sizes="64px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)]">
                        <FileText className="h-6 w-6 text-low" />
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {report.adminReply && (
          <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-glass)] p-4">
            <p className="text-xs uppercase tracking-wide text-low">Last reply sent</p>
            <p className="mt-2 whitespace-pre-line text-sm text-mid">{report.adminReply}</p>
          </div>
        )}
      </div>

      <div className="glass-surface rounded-[var(--radius-xl)] p-6">
        <h2 className="text-sm font-semibold">Respond</h2>
        <div className="mt-4">
          <ReportStatusForm reportId={report.id} currentStatus={report.status} />
        </div>
      </div>
    </div>
  );
}