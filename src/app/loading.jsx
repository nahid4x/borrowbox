export default function Loading() {
    return (<div className="flex min-h-screen items-center justify-center">
      <div className="glass-surface flex items-center gap-3 rounded-[var(--radius-pill)] px-5 py-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-accent)]"/>
        <span className="text-sm text-mid">Loading BorrowBox…</span>
      </div>
    </div>);
}
