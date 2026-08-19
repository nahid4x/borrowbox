import { notFound } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Tag, Sparkles, Package, Phone, Link2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/shared/status-badge";
import { ItemDetailActions } from "@/components/items/item-detail-actions";

export default async function ItemDetailsPage({ params }) {
  const { id } = await params;
  const session = await auth();
  const item = await prisma.item.findUnique({
    where: { id },
    include: { owner: { select: { id: true, name: true } }, category: true },
  });
  if (!item) notFound();
  const isOwner = item.ownerId === session.user.id;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-8 md:grid-cols-2">
      <div className="glass-surface relative flex aspect-square items-center justify-center overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-glass)]">
  {item.imageUrl ? (
    <Image
      src={item.imageUrl}
      alt={item.name}
      fill
      sizes="(min-width: 768px) 50vw, 100vw"
      className="object-contain"
    />
  ) : (
    <Package className="h-16 w-16 text-low" />
  )}
  <div className="absolute right-4 top-4">
    <StatusBadge status={item.isAvailable ? "AVAILABLE" : "UNAVAILABLE"} className="px-3 py-1 text-sm" />
  </div>
</div>
        <div>
          <p className="font-mono-ui text-xs uppercase tracking-wide text-low">{item.category.name}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{item.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-mid">{item.description}</p>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-mid">
              <Tag className="h-4 w-4" /> Condition:{" "}
              <span className="font-medium text-[var(--color-text-hi)]">{item.condition}</span>
            </div>
            <div className="flex items-center gap-2 text-mid">
              <CalendarDays className="h-4 w-4" /> Listed {item.createdAt.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2 text-mid">
              <Sparkles className="h-4 w-4" /> Owned by{" "}
              <span className="font-medium text-[var(--color-text-hi)]">{item.owner.name}</span>
            </div>
          </div>

          {(item.phoneNumber || item.socialUrl) && (
            <div className="glass-surface mt-6 rounded-[var(--radius-xl)] p-4">
              <h2 className="text-sm font-semibold text-[var(--color-text-hi)]">Contact Owner</h2>
              <div className="mt-3 space-y-2.5 text-sm">
                {item.phoneNumber && (
                  <a href={`tel:${item.phoneNumber}`} className="flex items-center gap-2 text-mid transition-colors hover:text-[var(--color-accent-light)]">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>{item.phoneNumber}</span>
                  </a>
                )}
                {item.socialUrl && (
                  <a href={item.socialUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mid transition-colors hover:text-[var(--color-accent-light)]">
                    <Link2 className="h-4 w-4 shrink-0" />
                    <span>Open Profile</span>
                  </a>
                )}
              </div>
            </div>
          )}

          <ItemDetailActions itemId={item.id} isOwner={isOwner} isAvailable={item.isAvailable} ownerName={item.owner.name} />
        </div>
      </div>
    </div>
  );
}