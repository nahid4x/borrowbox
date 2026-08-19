"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { UserRound, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassInput, FormField } from "@/components/ui/glass-input";
export function ProfileForm({ userId, name, email, studentId, avatarUrl, }) {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [nameValue, setNameValue] = useState(name);
    const [emailValue, setEmailValue] = useState(email);
    const [studentIdValue, setStudentIdValue] = useState(studentId ?? "");
    const [avatar, setAvatar] = useState(avatarUrl ?? null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    async function handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        setUploading(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Failed to upload image");
            return;
        }
        const data = await res.json();
        setAvatar(data.url);
        const patchRes = await fetch(`/api/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ avatarUrl: data.url }),
        });
        if (patchRes.ok) {
            toast.success("Profile photo updated");
            router.refresh();
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const res = await fetch(`/api/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: nameValue,
                email: emailValue,
                studentId: studentIdValue || null,
                avatarUrl: avatar,
            }),
        });
        setSubmitting(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Couldn't update your profile");
            return;
        }
        toast.success("Profile updated");
        router.refresh();
    }
    return (<form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--color-glass-hi)] border border-[var(--color-border)]">
            {avatar ? (<Image src={avatar} alt="Avatar" fill className="object-cover"/>) : (<UserRound className="h-7 w-7 text-low"/>)}
          </div>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploading} onChange={handleFileUpload}/>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-sm font-normal text-[var(--color-text-hi)] transition hover:border-[var(--color-accent)] hover:bg-[var(--color-glass)] disabled:opacity-60">
            <Upload className="h-3.5 w-3.5"/>
            {uploading ? "Uploading…" : "Upload a photo"}
          </button>
        </div>
      </div>

      <FormField label="Full name" htmlFor="name">
        <GlassInput id="name" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>
      </FormField>
      <FormField label="Email" htmlFor="email" hint="Must end in @diu.edu.bd">
        <GlassInput id="email" type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)}/>
      </FormField>
      <FormField label="Student ID" htmlFor="studentId">
        <GlassInput id="studentId" value={studentIdValue} onChange={(e) => setStudentIdValue(e.target.value)}/>
      </FormField>
      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Saving…" : "Save changes"}
      </Button>
    </form>);
}
