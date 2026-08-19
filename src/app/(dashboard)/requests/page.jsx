import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { RequestActions } from "@/components/requests/request-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { StopPropagation } from "@/components/requests/stop-propagation";
import { cn } from "@/lib/utils";

const STATUSES = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default async function RequestsPage({ searchParams, }) {
    const { tab: tabParam, status: statusParam } = await searchParams;
    const tab = tabParam === "received" ? "received" : "sent";
    const status = STATUSES.includes(statusParam?.toUpperCase()) ? statusParam.toUpperCase() : "ALL";
    const session = await auth();
    const userId = session.user.id;
    const requests = await prisma.borrowRequest.findMany({
        where: {
            ...(tab === "sent" ? { borrowerId: userId } : { item: { ownerId: userId } }),
            ...(status !== "ALL" ? { status } : {}),
        },
        include: {
            item: { include: { owner: { select: { id: true, name: true } } } },
            borrower: { select: { id: true, name: true } },
        },
        orderBy: { requestedAt: "desc" },
    });
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Borrow requests</h1>
        <p className="text-sm text-mid">Track requests you&apos;ve sent, and act on ones you&apos;ve received.</p>
      </div>

      <div className="flex w-fit gap-1 rounded-[var(--radius-md)] bg-[var(--color-glass)] p-1">
        {["sent", "received"].map((t) => (<Link key={t} href={`/requests?tab=${t}${status !== "ALL" ? `&status=${status}` : ""}`} className={cn("rounded-[var(--radius-md)] px-4 py-1.5 text-sm font-medium capitalize transition-colors", tab === t
                ? "bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                : "text-mid")}>
            {t === "sent" ? "Sent by me" : "Received by me"}
          </Link>))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (<Link key={s} href={`/requests?tab=${tab}${s !== "ALL" ? `&status=${s}` : ""}`} className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors", status === s
                ? "bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                : "bg-[var(--color-glass)] text-mid hover:text-[var(--color-text-hi)]")}>
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>))}
      </div>

      {requests.length === 0 ? (<EmptyState icon={ArrowLeftRight} title={tab === "sent" ? "You haven't requested anything" : "No requests yet"} description={tab === "sent"
                ? "Browse items and send your first borrow request."
                : "When someone requests one of your items, it'll show up here."}/>) : (<div className="space-y-3">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/items/${r.item.id}?requestId=${r.id}`}
              className="glass-surface flex flex-col gap-3 rounded-[var(--radius-xl)] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_var(--color-accent-dim)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{r.item.name}</p>
                <p className="text-sm text-mid">
                  {tab === "sent" ? `Owner: ${r.item.owner.name}` : `Requested by: ${r.borrower.name}`}
                </p>
              </div>
              <StopPropagation>
                <StatusBadge status={r.status}/>
                <RequestActions requestId={r.id} status={r.status} tab={tab}/>
              </StopPropagation>
            </Link>))}
        </div>)}
    </div>);
}