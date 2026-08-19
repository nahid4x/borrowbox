import { CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";

function formatDuration(start, end) {
  const days = Math.max(1, Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)));
  return `${days} day${days === 1 ? "" : "s"}`;
}

export default async function HistoryPage() {
  const session = await auth();
  const userId = session.user.id;

  const requests = await prisma.borrowRequest.findMany({
    where: { borrowerId: userId, status: "RETURNED" },
    include: {
      item: { include: { owner: { select: { id: true, name: true } } } },
    },
    orderBy: { returnedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Borrow history</h1>
        <p className="text-sm text-mid">Items you&apos;ve borrowed and returned.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No history yet"
          description="Completed borrows will show up here once items are returned."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="glass-surface flex flex-col gap-3 rounded-[var(--radius-xl)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{r.item.name}</p>
                <p className="text-sm text-mid">Owner: {r.item.owner.name}</p>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="text-xs text-low">
                  {r.decidedAt && r.returnedAt ? formatDuration(r.decidedAt, r.returnedAt) : "—"}
                </span>
                <span className="rounded-full bg-[var(--color-accent-dim)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent-light)]">
                  Returned Successfully
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}