"use client";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
export function BrowseFilters({ categories, currentQuery, currentCategory, onlyAvailable, }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(currentQuery);
    function updateParams(next) {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(next)) {
            if (value)
                params.set(key, value);
            else
                params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    }
    return (<div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={(e) => {
            e.preventDefault();
            updateParams({ q: query || null });
        }} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-low"/>
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search by item name or owner…" className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-dim)]"/>
        </form>
        <label className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] px-3 py-2.5 text-sm">
          <SlidersHorizontal className="h-4 w-4 text-low"/>
          <input type="checkbox" checked={onlyAvailable} onChange={(e) => updateParams({ available: e.target.checked ? "true" : null })} className="accent-[var(--color-accent)]"/>
          Available only
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => updateParams({ category: null })} className={cn("rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-medium transition-colors", !currentCategory
            ? "border-transparent bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
            : "border-[var(--color-border)] text-mid hover:bg-[var(--color-glass)]")}>
          All
        </button>
        {categories.map((cat) => (<button key={cat} onClick={() => updateParams({ category: cat })} className={cn("rounded-[var(--radius-pill)] border px-3 py-1.5 text-xs font-medium transition-colors", currentCategory === cat
                ? "border-transparent bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                : "border-[var(--color-border)] text-mid hover:bg-[var(--color-glass)]")}>
            {cat}
          </button>))}
      </div>
    </div>);
}
