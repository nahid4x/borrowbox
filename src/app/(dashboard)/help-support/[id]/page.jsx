import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/shared/status-badge";
import { humanizeEnum } from "@/lib/utils";

const TIMELINE_STEPS = ["RECEIVED", "UNDER_REVIEW", "RESOLVED"];

export default async function ReportDetailPage({ params }) {
  const { id } = await params;
  const session = await auth();
  const report = await prisma.report.findUnique({ where: { id } });

  if (!report || report.userId !== session.user.id) notFound();

  const currentStepIndex = TIMELINE_STEPS.indexOf(report.status);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/help-support" className="flex items-center gap-1.5 text-sm text-mid hover:text-[var(--color-text-hi)]">
        <ArrowLeft className="h-4 w-4" /> Back to Help &amp; Support
      </Link>

      <div className="glass-surface rounded-[var(--radius-xl)] p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-xs text-low">{report.referenceCode}</p>
            <h1 className="mt-1 text-xl font-bold">{humanizeEnum(report.category)}</h1>
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
      <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--color-accent-dim)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-accent-light)]">Support reply</p>
      <p className="mt-2 whitespace-pre-line text-sm text-[var(--color-text-hi)]">{report.adminReply}</p>
     </div>
         )}
      </div>

      <div className="glass-surface rounded-[var(--radius-xl)] p-6">
        <h2 className="text-sm font-semibold">Status timeline</h2>
        {report.status === "REJECTED" || report.status === "NEED_MORE_INFO" || report.status === "CLOSED" ? (
          <p className="mt-3 text-sm text-mid">
            Current status: <span className="font-medium text-[var(--color-text-hi)]">{humanizeEnum(report.status)}</span>
          </p>
        ) : (
          <ol className="mt-4 space-y-4">
            {TIMELINE_STEPS.map((step, i) => {
              const reached = currentStepIndex >= i;
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      reached
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[var(--color-glass)] text-low"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={reached ? "text-sm font-medium text-[var(--color-text-hi)]" : "text-sm text-low"}>
                    {step === "RECEIVED" ? "Report Submitted" : humanizeEnum(step)}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}