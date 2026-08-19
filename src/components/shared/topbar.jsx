"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Search, Bell, LogOut } from "lucide-react";
import Image from "next/image";
export function Topbar({ userName, userRole, unreadCount, avatarUrl, }) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    function handleSearch(e) {
        e.preventDefault();
        if (query.trim())
            router.push(`/items?q=${encodeURIComponent(query.trim())}`);
    }
    return (<header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-bg-1)]/50 px-4 py-3 backdrop-blur-2xl lg:px-6">
      <form onSubmit={handleSearch} className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-low"/>
        <input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search items, categories, owners…" className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] py-2 pl-9 pr-3 text-sm outline-none placeholder:text-low focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-dim)]"/>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <button onClick={() => router.push("/notifications")} aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-mid hover:bg-[var(--color-glass)]">
          <Bell className="h-4 w-4"/>
          {unreadCount > 0 && (<span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-danger)]"/>)}
        </button>
        <div className="flex items-center gap-2 pl-1">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-accent-dim)] text-xs font-semibold text-[var(--color-accent-light)]">
            {avatarUrl ? (<Image src={avatarUrl} alt={userName} fill sizes="32px" className="object-cover"/>) : (userName.split(" ").map((n) => n[0]).join("").slice(0, 2))}
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-[11px] text-low">{userRole}</p>
          </div>
        </div>
        <button onClick={() => signOut({ callbackUrl: "/" })} aria-label="Log out" className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-mid hover:bg-[var(--color-glass)]">
          <LogOut className="h-4 w-4"/>
        </button>
      </div>
    </header>);
}
