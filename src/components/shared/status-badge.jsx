
import { cn } from "@/lib/utils";
const statusConfig = {
    AVAILABLE: { label: "Available", bg: "var(--color-success-dim)", text: "var(--color-success)" },
    UNAVAILABLE: { label: "Unavailable", bg: "var(--color-danger-dim)", text: "var(--color-danger)" },
    PENDING: { label: "Pending", bg: "var(--color-warn-dim)", text: "var(--color-warn)" },
    APPROVED: { label: "Approved", bg: "var(--color-success-dim)", text: "var(--color-success)" },
    REJECTED: { label: "Rejected", bg: "var(--color-danger-dim)", text: "var(--color-danger)" },
    BORROWED: { label: "Borrowed", bg: "var(--color-warn-dim)", text: "var(--color-warn)" },
    RETURNED: { label: "Returned", bg: "var(--color-success-dim)", text: "var(--color-success)" },
    CANCELLED: { label: "Cancelled", bg: "var(--color-glass-hi)", text: "var(--color-text-low)" },
    RECEIVED: { label: "Received", bg: "var(--color-glass-hi)", text: "var(--color-text-low)" },
    UNDER_REVIEW: { label: "Under Review", bg: "var(--color-warn-dim)", text: "var(--color-warn)" },
    NEED_MORE_INFO: { label: "Need More Info", bg: "var(--color-warn-dim)", text: "var(--color-warn)" },
    RESOLVED: { label: "Resolved", bg: "var(--color-success-dim)", text: "var(--color-success)" },
    CLOSED: { label: "Closed", bg: "var(--color-glass-hi)", text: "var(--color-text-low)" },
};
export function StatusBadge({ status, className }) {
    const cfg = statusConfig[status] ?? { label: status, bg: "var(--color-glass-hi)", text: "var(--color-text-low)" };
    return (<span className={cn("inline-block rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-semibold", className)} style={{ backgroundColor: cfg.bg, color: cfg.text }}>
      {cfg.label}
    </span>);
}