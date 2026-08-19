import Link from "next/link";
import { PackagePlus, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/items/item-card";
import { EmptyState } from "@/components/shared/empty-state";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function MyItemsPage() {
    const session = await auth();
    const myItems = await prisma.item.findMany({
        where: { ownerId: session.user.id },
        include: { category: true, owner: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
    });
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My items</h1>
          <p className="text-sm text-mid">Everything you&apos;ve listed for borrowing.</p>
        </div>
        <Button asChild variant="primary">
          <Link href="/items/new">
            <PackagePlus className="h-4 w-4"/> Add item
          </Link>
        </Button>
      </div>

      {myItems.length === 0 ? (<EmptyState icon={Archive} title="You haven't listed anything yet" description="Got a calculator, charger, or textbook you're not using? List it and help a classmate out."/>) : (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myItems.map((item) => (<ItemCard key={item.id} item={item}/>))}
        </div>)}
    </div>);
}
