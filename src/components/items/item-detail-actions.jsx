"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const POLL_INTERVAL_MS = 5000;

export function ItemDetailActions({ itemId, isOwner, isAvailable, ownerName, }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [submitting, setSubmitting] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(!isOwner);
    const [myRequest, setMyRequest] = useState(null);
    const notifiedRejectedRef = useRef(false);

    const fetchMyRequest = useCallback(async () => {
        if (isOwner) return;
        try {
            const res = await fetch(`/api/requests?scope=mine&itemId=${itemId}`);
            if (!res.ok) return;
            const data = await res.json();
            const latest = Array.isArray(data) ? data[0] ?? null : null;
            setMyRequest((prev) => {
                if (
                    latest?.status === "REJECTED" &&
                    prev?.status === "PENDING" &&
                    !notifiedRejectedRef.current
                ) {
                    notifiedRejectedRef.current = true;
                    toast("Your previous request was rejected. You can request again.");
                }
                if (latest?.status === "APPROVED" && prev?.status === "PENDING") {
                    toast.success("Your borrow request was approved!");
                }
                return latest;
            });
        } finally {
            setLoadingStatus(false);
        }
    }, [itemId, isOwner]);

    useEffect(() => {
        fetchMyRequest();
    }, [fetchMyRequest]);

    useEffect(() => {
        if (isOwner) return;
        if (myRequest?.status !== "PENDING") return;
        const interval = setInterval(fetchMyRequest, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [isOwner, myRequest?.status, fetchMyRequest]);

    async function handleBorrowRequest() {
        setSubmitting(true);
        const res = await fetch("/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId }),
        });
        setSubmitting(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Couldn't send the request");
            if (res.status === 409) fetchMyRequest();
            return;
        }
        const created = await res.json();
        notifiedRejectedRef.current = false;
        setMyRequest(created);
        toast.success("Borrow request sent successfully.");
        router.refresh();
    }

    async function handleCancel() {
        if (!myRequest) return;
        setCancelling(true);
        const res = await fetch(`/api/requests/${myRequest.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "cancel" }),
        });
        setCancelling(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Couldn't cancel this request");
            return;
        }
        toast.success("Request cancelled");
        fetchMyRequest();
        router.refresh();
    }

    async function handleDelete() {
        if (!confirm("Delete this item? This can't be undone."))
            return;
        const res = await fetch(`/api/items/${itemId}`, { method: "DELETE" });
        if (!res.ok) {
            toast.error("Couldn't delete this item");
            return;
        }
        toast.success("Item deleted");
        router.push("/my-items");
    }

    if (isOwner) {
        return (
            <div className="mt-8 flex gap-3">
                <Button asChild variant="secondary">
                    <Link href={`/items/${itemId}/edit`}>Edit item</Link>
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                    Delete item
                </Button>
            </div>
        );
    }

    const status = myRequest?.status;
    const hasActiveOwnRequest = status === "PENDING" || status === "APPROVED";

    if (loadingStatus) {
        return (
            <div className="mt-8">
                <Button variant="primary" size="lg" disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
            </div>
        );
    }

    if (status === "APPROVED") {
        return (
            <div className="mt-8 space-y-3">
                <Button
                    variant="primary"
                    size="lg"
                    disabled
                    className="bg-[var(--color-success)] text-white hover:bg-[var(--color-success)] disabled:opacity-100"
                >
                    <Check className="h-4 w-4" /> Borrow Approved
                </Button>
                {myRequest?.decidedAt && (
                    <p className="text-xs text-low">
                        Approved on {new Date(myRequest.decidedAt).toLocaleDateString()}
                    </p>
                )}
            </div>
        );
    }

    if (status === "PENDING") {
        return (
            <div className="mt-8 space-y-3">
                <Button variant="primary" size="lg" disabled>
                    <Check className="h-4 w-4" /> Requested
                </Button>
                <p className="text-xs text-low">
                    Requested on {myRequest?.requestedAt ? new Date(myRequest.requestedAt).toLocaleDateString() : ""} — waiting for {ownerName} to respond.
                </p>
                <div>
                    <Button variant="secondary" size="sm" disabled={cancelling} onClick={handleCancel}>
                        {cancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                        Cancel request
                    </Button>
                </div>
            </div>
        );
    }

    if (status === "REJECTED") {
        return (
            <div className="mt-8 space-y-3">
                <p className="text-sm text-mid">
                    Your previous request for this item was declined.
                    {myRequest?.decidedAt && ` (${new Date(myRequest.decidedAt).toLocaleDateString()})`}
                </p>
                <Button variant="primary" size="lg" disabled={submitting} onClick={handleBorrowRequest}>
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request to borrow"}
                </Button>
            </div>
        );
    }

    if (!isAvailable && !hasActiveOwnRequest) {
        return (
            <div className="mt-8">
                <Button variant="secondary" size="lg" disabled>
                    Currently Unavailable
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <Button variant="primary" size="lg" disabled={submitting} onClick={handleBorrowRequest}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request to borrow"}
            </Button>
        </div>
    );
}