"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassSelect, GlassTextarea, FormField } from "@/components/ui/glass-input";

const STATUSES = ["RECEIVED", "UNDER_REVIEW", "NEED_MORE_INFO", "RESOLVED", "CLOSED", "REJECTED"];

export function ReportStatusForm({ reportId, currentStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`/api/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(reply.trim() ? { adminReply: reply.trim() } : {}) }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error(body?.error ?? "Couldn't update this report");
      return;
    }
    toast.success("Report updated");
    setReply("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Status" htmlFor="status">
        <GlassSelect id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase().replaceAll("_", " ")}</option>
          ))}
        </GlassSelect>
      </FormField>
      <FormField label="Reply to user (optional)" htmlFor="reply">
        <GlassTextarea
          id="reply"
          rows={4}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Explain what you found, ask for more info, or confirm resolution…"
        />
      </FormField>
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save & Notify User"}
      </Button>
    </form>
  );
}