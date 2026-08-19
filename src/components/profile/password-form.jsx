"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { GlassInput, FormField } from "@/components/ui/glass-input";
export function PasswordForm({ userId }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const res = await fetch(`/api/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
        });
        setSubmitting(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Couldn't change your password");
            return;
        }
        toast.success("Password changed");
        setCurrentPassword("");
        setNewPassword("");
    }
    return (<form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <FormField label="Current password" htmlFor="current">
        <GlassInput id="current" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
      </FormField>
      <FormField label="New password" htmlFor="new" hint="At least 8 characters">
        <GlassInput id="new" type="password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
      </FormField>
      <Button type="submit" variant="secondary" disabled={submitting}>
        {submitting ? "Updating…" : "Update password"}
      </Button>
    </form>);
}
