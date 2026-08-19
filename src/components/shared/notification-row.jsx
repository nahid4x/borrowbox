"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Check, X, PackageCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const iconFor = {
  REQUEST_RECEIVED: Bell,
  REQUEST_APPROVED: Check,
  REQUEST_REJECTED: X,
  ITEM_RETURNED: PackageCheck,
};

function destinationFor(type, relatedRequestId, relatedReportId) {
  const suffix = relatedRequestId ? `&highlight=${relatedRequestId}` : "";
  switch (type) {
    case "REQUEST_RECEIVED":
      return `/requests?tab=received&status=PENDING${suffix}`;
    case "REQUEST_APPROVED":
      return `/borrowed${relatedRequestId ? `?highlight=${relatedRequestId}` : ""}`;
    case "REQUEST_REJECTED":
      return `/requests?tab=sent&status=REJECTED${suffix}`;
    case "ITEM_RETURNED":
      return `/history${relatedRequestId ? `?highlight=${relatedRequestId}` : ""}`;
    case "REPORT_SUBMITTED":
      return "/admin/reports";
    case "REPORT_STATUS_UPDATED":
      return relatedReportId ? `/help-support/${relatedReportId}` : "/help-support";
    default:
      return null;
  }
}

function timeAgo(iso) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationRow({ id, type, message, isRead, createdAt, relatedRequestId, relatedReportId }) {
  const router = useRouter();
  const [read, setRead] = useState(isRead);
  const Icon = iconFor[type] ?? Bell;

  async function handleClick() {
    if (!read) {
      setRead(true);
      fetch(`/api/notifications/${id}`, { method: "PATCH" }).catch(() => {});
    }
    const destination = destinationFor(type, relatedRequestId, relatedReportId);
    if (destination) {
      router.push(destination);
    } else {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "glass-surface flex w-full items-start gap-3 rounded-[var(--radius-xl)] p-4 text-left transition-all cursor-pointer hover:-translate-y-0.5",
        read && "opacity-60"
      )}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent-light)]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className={cn("text-sm", !read && "font-semibold")}>{message}</p>
      </div>
      <span className="shrink-0 text-xs text-low">{timeAgo(createdAt)}</span>
      {!read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]" />}
    </button>
  );
}