"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BoxesIcon, PackagePlus, Archive, ArrowLeftRight, Bell, UserRound, ShieldCheck, Settings, MessageSquareWarning } from "lucide-react";
import { cn } from "@/lib/utils";
const nav = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/items", label: "Browse Items", icon: BoxesIcon },
    { href: "/items/new", label: "Add Item", icon: PackagePlus },
    { href: "/my-items", label: "My Items", icon: Archive },
    { href: "/requests", label: "Borrow Requests", icon: ArrowLeftRight },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings },
];
export function Sidebar({ isAdmin }) {
    const pathname = usePathname();
    return (<aside className="hidden w-60 shrink-0 flex-col gap-1 border-r border-[var(--color-border)] bg-[var(--color-bg-1)]/60 px-3 py-6 backdrop-blur-2xl lg:flex">
      <Link href="/" className="mark mb-8 flex items-center gap-2.5 px-3">
        <div className="spinner">
          <div /><div /><div /><div /><div /><div />
        </div>
        <span className="text-lg font-bold tracking-tight">BorrowBox</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (<Link key={href} href={href} className={cn("flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors", active
                    ? "bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                    : "text-mid hover:bg-[var(--color-glass)] hover:text-[var(--color-text-hi)]")}>
              <Icon className="h-4 w-4"/>
              {label}
            </Link>);
        })}
      </nav>

      {isAdmin && (<>
      <Link href="/admin" className={cn("flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors", pathname === "/admin"
                ? "bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                : "text-mid hover:bg-[var(--color-glass)]")}>
          <ShieldCheck className="h-4 w-4"/>
          Admin Dashboard
        </Link>
      <Link href="/admin/reports" className={cn("flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors", pathname.startsWith("/admin/reports")
                ? "bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]"
                : "text-mid hover:bg-[var(--color-glass)]")}>
          <MessageSquareWarning className="h-4 w-4"/>
          Reports
        </Link>
      </>)}
    </aside>);
}