"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Check, Paperclip, X, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GlassInput, GlassSelect, GlassTextarea, FormField } from "@/components/ui/glass-input";

const CATEGORIES = [
  ["BUG_REPORT", "Bug Report"],
  ["APP_CRASH", "App Crash"],
  ["UI_DISPLAY_ISSUE", "UI / Display Issue"],
  ["FEATURE_REQUEST", "Feature Request"],
  ["PERFORMANCE_ISSUE", "Performance Issue"],
  ["LOGIN_PROBLEM", "Login Problem"],
  ["BORROW_REQUEST_ISSUE", "Borrow Request Issue"],
  ["ITEM_LISTING_ISSUE", "Item Listing Issue"],
  ["NOTIFICATION_ISSUE", "Notification Issue"],
  ["SCAM_OR_FRAUD", "Scam or Fraud"],
  ["FAKE_LISTING", "Fake Listing"],
  ["HARASSMENT_OR_ABUSE", "Harassment or Abuse"],
  ["INAPPROPRIATE_CONTENT", "Inappropriate Content"],
  ["SPAM", "Spam"],
  ["ACCOUNT_ISSUE", "Account Issue"],
  ["SECURITY_CONCERN", "Security Concern"],
  ["PRIVACY_CONCERN", "Privacy Concern"],
  ["PAYMENT_ISSUE", "Payment Issue (Future)"],
  ["OTHER", "Other"],
];

const MAX_FILES = 10;
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/png,image/webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain";

export function HelpSupportForm({ userEmail }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [values, setValues] = useState({
    category: "",
    priority: "MEDIUM",
    description: "",
    email: userEmail ?? "",
  });
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submittedReport, setSubmittedReport] = useState(null);

  function validate() {
    const nextErrors = {};
    if (!values.category) nextErrors.category = "Please select a category.";
    if (values.description.trim().length < 20) nextErrors.description = "Please describe the issue in at least 20 characters.";
    if (!values.email) nextErrors.email = "Email is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    if (attachments.length + files.length > MAX_FILES) {
      toast.error(`You can attach up to ${MAX_FILES} files.`);
      return;
    }

    setUploading(true);
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is over 20MB.`);
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/reports/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        toast.error(body?.error ?? `Couldn't upload ${file.name}`);
        continue;
      }
      const uploaded = await res.json();
      setAttachments((prev) => [...prev, uploaded]);
    }
    setUploading(false);
  }

  function removeAttachment(url) {
    setAttachments((prev) => prev.filter((a) => a.url !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, attachments: attachments.map((a) => a.url) }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      toast.error(body?.error ?? "Couldn't submit your report");
      return;
    }
    const report = await res.json();
    setSubmittedReport(report);
  }

  function resetForm() {
    setValues({ category: "", priority: "MEDIUM", description: "", email: userEmail ?? "" });
    setAttachments([]);
    setErrors({});
    setSubmittedReport(null);
  }

  if (submittedReport) {
    return (
      <div className="glass-surface rounded-[var(--radius-xl)] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success-dim)] text-[var(--color-success)]">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Report Submitted</h2>
        <p className="mt-2 text-sm text-mid">Your report has been received successfully.</p>
        <p className="mt-4 font-mono-ui text-sm text-[var(--color-accent-light)]">
          Reference ID: {submittedReport.referenceCode}
        </p>
        <p className="mt-4 text-sm text-mid">
          Our support team will review your report and contact you if more information is required.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
          <Button variant="primary" onClick={resetForm}>
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Report Category *" htmlFor="category" error={errors.category}>
        <GlassSelect
          id="category"
          required
          value={values.category}
          onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
        >
          <option value="" disabled>Select a category</option>
          {CATEGORIES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </GlassSelect>
      </FormField>

      <FormField label="Upload Evidence" htmlFor="attachments" hint="Images, PDF, DOCX, or TXT — up to 10 files, 20MB each">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || attachments.length >= MAX_FILES}
          className="flex w-full max-w-sm items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-glass)] px-3.5 py-3 text-sm text-mid transition-colors hover:border-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Add files"}
        </button>
        <input
          ref={fileInputRef}
          id="attachments"
          type="file"
          multiple
          accept={ACCEPTED}
          className="hidden"
          onChange={handleFilesSelected}
        />

        {attachments.length > 0 && (
          <ul className="mt-3 space-y-2">
            {attachments.map((a) => (
              <li key={a.url} className="flex items-center gap-3 rounded-[var(--radius-md)] bg-[var(--color-glass)] px-3 py-2">
                {a.type?.startsWith("image/") ? (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)]">
                    <Image src={a.url} alt={a.name} fill sizes="40px" className="object-cover" />
                  </div>
                ) : (
                  <FileText className="h-5 w-5 shrink-0 text-low" />
                )}
                <span className="flex-1 truncate text-xs text-mid">{a.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(a.url)}
                  className="shrink-0 rounded-full p-1 text-low transition-colors hover:bg-[var(--color-danger-dim)] hover:text-[var(--color-danger)]"
                  aria-label={`Remove ${a.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </FormField>

      <div>
        <FormField label="Describe the Issue *" htmlFor="description" error={errors.description}>
          <GlassTextarea
            id="description"
            required
            rows={6}
            minLength={20}
            maxLength={3000}
            value={values.description}
            onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
            placeholder={"Describe exactly what happened.\nWhat were you trying to do?\nWhat did you expect?\nWhat actually happened?"}
          />
        </FormField>
        <p className="mt-1.5 max-w-sm text-right text-xs text-low">{values.description.length}/3000</p>
      </div>

      <FormField label="Contact Email *" htmlFor="email" error={errors.email}>
        <GlassInput
          id="email"
          type="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
      </FormField>

      <Button type="submit" variant="primary" size="lg" disabled={submitting || uploading}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Report"}
      </Button>
    </form>
  );
}