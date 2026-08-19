"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
export function RequestActions({ requestId, status, tab, }) {
    const router = useRouter();
    const [pending, setPending] = useState(false);
    async function act(action, successMessage) {
        setPending(true);
        const res = await fetch(`/api/requests/${requestId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action }),
        });
        setPending(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Couldn't update this request");
            return;
        }
        toast.success(successMessage);
        router.refresh();
    }
    if (tab === "received" && status === "PENDING") {
        return (<div className="flex gap-2">
        <Button size="sm" variant="primary" disabled={pending} onClick={() => act("approve", "Request approved")}>
          <Check className="h-3.5 w-3.5"/> Approve
        </Button>
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => act("reject", "Request rejected")}>
          <X className="h-3.5 w-3.5"/> Reject
        </Button>
      </div>);
    }
    if (tab === "received" && status === "APPROVED") {
        return (<Button size="sm" variant="secondary" disabled={pending} onClick={() => act("mark_borrowed", "Marked as borrowed")}>
        Mark borrowed
      </Button>);
    }
    if (tab === "received" && status === "BORROWED") {
        return (<Button size="sm" variant="secondary" disabled={pending} onClick={() => act("mark_returned", "Marked as returned")}>
        <PackageCheck className="h-3.5 w-3.5"/> Mark returned
      </Button>);
    }
    if (tab === "sent" && status === "PENDING") {
        return (<Button size="sm" variant="secondary" disabled={pending} onClick={() => act("cancel", "Request cancelled")}>
        Cancel
      </Button>);
    }
    return null;
}
