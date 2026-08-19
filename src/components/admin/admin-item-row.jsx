"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
export function AdminItemRow({ id, name, ownerName, categoryName, isAvailable, }) {
    const router = useRouter();
    const [removing, setRemoving] = useState(false);
    async function handleRemove() {
        if (!confirm(`Remove "${name}"? This can't be undone.`))
            return;
        setRemoving(true);
        const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
        setRemoving(false);
        if (!res.ok) {
            toast.error("Couldn't remove this item");
            return;
        }
        toast.success(`Removed "${name}"`);
        router.refresh();
    }
    return (<tr className="border-b border-[var(--color-border)]/60">
      <td className="py-2.5 font-medium">{name}</td>
      <td className="py-2.5 text-mid">{ownerName}</td>
      <td className="py-2.5 text-mid">{categoryName}</td>
      <td className="py-2.5">
        <StatusBadge status={isAvailable ? "AVAILABLE" : "UNAVAILABLE"}/>
      </td>
      <td className="py-2.5 text-right">
        <button onClick={handleRemove} disabled={removing} className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-danger)] hover:underline disabled:opacity-50">
          <Trash2 className="h-3.5 w-3.5"/> Remove
        </button>
      </td>
    </tr>);
}
