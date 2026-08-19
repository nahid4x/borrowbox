import Link from "next/link";
import { Package, ArrowLeftRight, Clock3, CheckCircle2, ArrowRight, Archive, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ItemCard } from "@/components/items/item-card";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function DashboardPage() {
    const session = await auth();
    const userId = session.user.id;
    const [itemsListedCount, myRequests, myItems, recentItems, returnedCount] = await Promise.all([
        prisma.item.count({ where: { ownerId: userId } }),
        prisma.borrowRequest.findMany({
            where: { borrowerId: userId },
            include: { item: { include: { owner: { select: { name: true } } } } },
            orderBy: { requestedAt: "desc" },
            take: 4,
        }),
        prisma.item.findMany({
            where: { ownerId: userId },
            include: { category: true, owner: { select: { id: true, name: true } } },
            orderBy: { createdAt: "desc" },
            take: 4,
        }),
        prisma.item.findMany({
            where: { ownerId: { not: userId } },
            include: { category: true, owner: { select: { id: true, name: true } } },
            orderBy: { createdAt: "desc" },
            take: 3,
        }),
        prisma.borrowRequest.count({ where: { borrowerId: userId, status: "RETURNED" } }),
    ]);
    const pendingCount = myRequests.filter((r) => r.status === "PENDING").length;
    const stats = [
        { label: "Items I've listed", value: itemsListedCount, icon: Package },
        { label: "Items borrowed", value: myRequests.length, icon: ArrowLeftRight },
         { label: "Pending requests", value: pendingCount, icon: Clock3, href: "/requests?tab=received&status=PENDING" },
        { label: "Returned safely", value: returnedCount, icon: CheckCircle2 },
    ];
    return (<div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {session.user.name?.split(" ")[0]}</h1>
        <p className="text-sm text-mid">Here&apos;s what&apos;s happening with your items and requests.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (<GlassCard key={label}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-low">{label}</p>
              <Icon className="h-4 w-4 text-low"/>
            </div>
            <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          </GlassCard>))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My borrow requests</h2>
            <Link href="/requests" className="text-sm font-medium text-[var(--color-accent-light)] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {myRequests.length === 0 ? (<EmptyState icon={ArrowLeftRight} title="No borrow requests yet" description="Browse items and send your first request."/>) : (myRequests.map((r) => (<div key={r.id} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-glass)] px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{r.item.name}</p>
                    <p className="text-xs text-low">from {r.item.owner.name}</p>
                  </div>
                  <StatusBadge status={r.status}/>
                </div>)))}
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-semibold">My listed items</h2>
          <div className="mt-4 space-y-3">
            {myItems.length === 0 ? (<EmptyState icon={Archive} title="Nothing listed yet" description="Share something you're not using."/>) : (myItems.map((item) => (<div key={item.id} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-glass)] px-3 py-2.5">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-low">{item.category.name}</p>
                  </div>
                  <StatusBadge status={item.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}/>
                </div>)))}
          </div>
          <Button asChild variant="secondary" size="sm" className="mt-4 w-full">
            <Link href="/items/new">List a new item</Link>
          </Button>
        </GlassCard>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recently listed near you</h2>
          <Link href="/items" className="flex items-center gap-1 text-sm font-medium text-[var(--color-accent-light)] hover:underline">
            Browse all <ArrowRight className="h-3.5 w-3.5"/>
          </Link>
        </div>
        <div className="mt-4">
          {recentItems.length === 0 ? (<EmptyState icon={PackageSearch} title="No items listed yet" description="Be the first to share something with your classmates."/>) : (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentItems.map((item) => (<ItemCard key={item.id} item={item}/>))}
            </div>)}
        </div>
      </div>
    </div>);
}
