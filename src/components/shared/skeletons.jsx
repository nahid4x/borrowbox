import { cn } from "@/lib/utils";
export function Skeleton({ className }) {
    return <div className={cn("skeleton rounded-md", className)}/>;
}
export function ItemCardSkeleton() {
    return (<div className="glass-surface rounded-[var(--radius-xl)] p-4">
      <Skeleton className="h-32 w-full rounded-lg"/>
      <Skeleton className="mt-4 h-4 w-3/4"/>
      <Skeleton className="mt-2 h-3 w-1/2"/>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-5 w-16"/>
        <Skeleton className="h-8 w-20 rounded-lg"/>
      </div>
    </div>);
}
export function ItemGridSkeleton({ count = 6 }) {
    return (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (<ItemCardSkeleton key={i}/>))}
    </div>);
}
export function RowSkeleton() {
    return (<div className="glass-surface flex items-center gap-4 rounded-[var(--radius-lg)] p-3">
      <Skeleton className="h-10 w-10 rounded-full"/>
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-1/3"/>
        <Skeleton className="h-3 w-1/4"/>
      </div>
      <Skeleton className="h-6 w-16 rounded"/>
    </div>);
}
export function StatCardSkeleton() {
    return (<div className="glass-surface rounded-[var(--radius-xl)] p-5">
      <Skeleton className="h-3 w-20"/>
      <Skeleton className="mt-3 h-8 w-14"/>
    </div>);
}
