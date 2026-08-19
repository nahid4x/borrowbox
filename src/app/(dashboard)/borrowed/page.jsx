import { ArrowLeftRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";

export default async function BorrowedItemsPage() {
  const session = await auth();
  const userId = session.user.id;

  const requests = await prisma.borrowRequest.findMany({
    where: {
      borrowerId: userId,
      status: { in: ["APPROVED", "BORROWED"] },
    },
    include: {
      item: { include: { owner: { select: { id: true, name: true } } } },
    },
    orderBy: { decidedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Borrowed items</h1>
        <p className="text-sm text-mid">Items you&apos;re currently approved for or holding.</p>
      </div>

      {requests.length === 0 ? (
        <EmptyState icon={ArrowLeftRight} title="No borrowed items" description="Items you're approved to borrow will show up here." />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className="glass-surface flex flex-col gap-3 rounded-[var(--radius-xl)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">{r.item.name}</p>
                <p className="text-sm text-mid">Owner: {r.item.owner.name}</p>
                {r.item.phoneNumber && (
                  <a href={`tel:${r.item.phoneNumber}`} className="mt-1 inline-block text-xs text-[var(--color-accent-light)] hover:underline">
                    {r.item.phoneNumber}
                  </a>
                )}
              </div>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}