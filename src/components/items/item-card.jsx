import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { GlassCard } from "@/components/ui/glass-card";
function timeAgo(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
    const units = [
        [60, "s"],
        [60, "m"],
        [24, "h"],
        [30, "d"],
    ];
    let value = seconds;
    let label = "s";
    for (const [divisor, unit] of units) {
        if (value < divisor) {
            label = unit;
            break;
        }
        value = Math.floor(value / divisor);
        label = unit;
    }
    return `${value}${label} ago`;
}
export function ItemCard({ item }) {
    return (<Link href={`/items/${item.id}`}>
      <GlassCard hoverable className="p-4">
        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-glass-hi)]">
          {item.imageUrl ? (<Image src={item.imageUrl} alt={item.name} fill className="object-cover"/>) : (<Package className="h-8 w-8 text-low"/>)}
          <div className="absolute right-2 top-2">
            <StatusBadge status={item.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}/>
          </div>
        </div>
        <div className="mt-4">
          <p className="font-mono-ui text-[11px] uppercase tracking-wide text-low">{item.category.name}</p>
          <h3 className="mt-0.5 text-base font-semibold leading-snug">{item.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-mid">{item.description}</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-low">
          <span>Owner: {item.owner.name}</span>
          <span>{timeAgo(item.createdAt)}</span>
        </div>
      </GlassCard>
    </Link>);
}
