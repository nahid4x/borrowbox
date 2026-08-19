import { Users, Package, ArrowLeftRight, PackageCheck, Clock3, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { AdminItemRow } from "@/components/admin/admin-item-row";
export default async function AdminDashboardPage() {
    const session = await auth();
    // Defense in depth — middleware already blocks non-admins from this
    // route, but the page checks again in case middleware config ever drifts.
    if (session.user.role !== "ADMIN")
        redirect("/dashboard");
    const [totalUsers, totalItems, borrowedItems, returnedItems, pendingRequests, items, recentRequests] = await Promise.all([
        prisma.user.count(),
        prisma.item.count(),
        prisma.borrowRequest.count({ where: { status: "BORROWED" } }),
        prisma.borrowRequest.count({ where: { status: "RETURNED" } }),
        prisma.borrowRequest.count({ where: { status: "PENDING" } }),
        prisma.item.findMany({
            include: { owner: { select: { name: true } }, category: true },
            orderBy: { createdAt: "desc" },
            take: 20,
        }),
        prisma.borrowRequest.findMany({
            include: { item: { select: { name: true } }, borrower: { select: { name: true } } },
            orderBy: { requestedAt: "desc" },
            take: 10,
        }),
    ]);
    const stats = [
        { label: "Total users", value: totalUsers, icon: Users },
        { label: "Total items", value: totalItems, icon: Package },
        { label: "Borrowed items", value: borrowedItems, icon: ArrowLeftRight },
        { label: "Returned items", value: returnedItems, icon: PackageCheck },
        { label: "Pending requests", value: pendingRequests, icon: Clock3 },
    ];
    return (<div className="space-y-8">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-[var(--color-accent-light)]"/>
        <h1 className="text-2xl font-bold tracking-tight">Admin dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (<GlassCard key={label}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-low">{label}</p>
              <Icon className="h-4 w-4 text-low"/>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          </GlassCard>))}
      </div>

      <GlassCard>
        <h2 className="text-lg font-semibold">All items (moderation)</h2>
        {items.length === 0 ? (<div className="mt-4">
            <EmptyState icon={Package} title="No items listed yet" description="Items will appear here once students start listing them."/>
          </div>) : (<div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-low">
                  <th className="pb-2 font-medium">Item</th>
                  <th className="pb-2 font-medium">Owner</th>
                  <th className="pb-2 font-medium">Category</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (<AdminItemRow key={item.id} id={item.id} name={item.name} ownerName={item.owner.name} categoryName={item.category.name} isAvailable={item.isAvailable}/>))}
              </tbody>
            </table>
          </div>)}
      </GlassCard>

      <GlassCard>
        <h2 className="text-lg font-semibold">Recent borrow activity</h2>
        {recentRequests.length === 0 ? (<div className="mt-4">
            <EmptyState icon={ArrowLeftRight} title="No borrow activity yet" description="Requests will appear here as students start borrowing."/>
          </div>) : (<div className="mt-4 space-y-2">
            {recentRequests.map((r) => (<div key={r.id} className="flex items-center justify-between rounded-[var(--radius-md)] bg-[var(--color-glass)] px-4 py-2.5 text-sm">
                <span>
                  <span className="font-medium">{r.borrower.name}</span> requested{" "}
                  <span className="font-medium">{r.item.name}</span>
                </span>
                <StatusBadge status={r.status}/>
              </div>))}
          </div>)}
      </GlassCard>
    </div>);
}
