"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GlassInput, GlassSelect, GlassTextarea, FormField } from "@/components/ui/glass-input";

function isValidPhone(phone) {
  if (!phone || phone.trim().length === 0) return false;
  if (phone.length > 20) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10;
}

function isValidUrl(url) {
  if (!url) return true; // optional
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function ItemForm({ categories, mode, itemId, initialValues, }) {
    const router = useRouter();
    const [values, setValues] = useState(() => {
      if (initialValues) {
        return {
          ...initialValues,
          quantity: initialValues.quantity ?? 1,
          contact: {
            phoneNumber: initialValues.contact?.phoneNumber ?? initialValues.phoneNumber ?? "",
            socialUrl: initialValues.contact?.socialUrl ?? initialValues.socialUrl ?? "",
          },
        };
      }
      return {
        name: "",
        description: "",
        categoryId: categories[0]?.id ?? "",
        condition: "GOOD",
        imageUrl: null,
        quantity: 1,
        contact: { phoneNumber: "", socialUrl: "" },
      };
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    async function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        setUploading(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Failed to upload image");
            return;
        }
        const data = await res.json();
        setValues((v) => ({ ...v, imageUrl: data.url }));
    }
    function removeImage() {
        setValues((v) => ({ ...v, imageUrl: null }));
    }

    function setContact(field, value) {
      setValues((v) => ({ ...v, contact: { ...v.contact, [field]: value } }));
      setErrors((e) => ({ ...e, [field]: undefined }));
    }

    function validate() {
      const nextErrors = {};
      if (!isValidPhone(values.contact.phoneNumber)) {
        nextErrors.phoneNumber = "Phone number is required.";
      }
      if (values.contact.socialUrl && !isValidUrl(values.contact.socialUrl)) {
        nextErrors.socialUrl = "Enter a valid URL.";
      }
      if (!values.quantity || Number(values.quantity) < 1) {
        nextErrors.quantity = "Quantity must be at least 1.";
      }
      setErrors(nextErrors);
      return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        const url = mode === "create" ? "/api/items" : `/api/items/${itemId}`;
        const method = mode === "create" ? "POST" : "PATCH";

        const { contact, ...rest } = values;
        const payload = {
          ...rest,
          phoneNumber: contact.phoneNumber.trim(),
          socialUrl: contact.socialUrl?.trim() || null,
          quantity: Number(values.quantity) || 1,
        };

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        setSubmitting(false);
        if (!res.ok) {
            const body = await res.json().catch(() => null);
            toast.error(body?.error ?? "Something went wrong");
            return;
        }
        toast.success(mode === "create" ? "Item listed successfully" : "Item updated");
        router.push(mode === "create" ? "/my-items" : `/items/${itemId}`);
        router.refresh();
    }

    return (<form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {values.imageUrl ? (<div className="relative h-40 w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)]">
          <Image src={values.imageUrl} alt="Item preview" fill className="object-cover"/>
          <button type="button" onClick={removeImage} className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80" aria-label="Remove image">
            <X className="h-4 w-4"/>
          </button>
        </div>) : (<label htmlFor="image" className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--color-border)] bg-[var(--color-glass)] text-mid transition-colors hover:border-[var(--color-accent)]">
          <ImagePlus className="h-6 w-6"/>
          <span className="text-sm">{uploading ? "Uploading…" : "Click to upload a photo"}</span>
          <input id="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" disabled={uploading} onChange={handleImageChange}/>
        </label>)}

      <FormField label="Item name" htmlFor="name">
        <GlassInput id="name" required value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} placeholder="e.g. Calculator"/>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Category" htmlFor="category">
          <GlassSelect id="category" required value={values.categoryId} onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))}>
            {categories.map((c) => (<option key={c.id} value={c.id}>
                {c.name}
              </option>))}
          </GlassSelect>
        </FormField>
        <FormField label="Condition" htmlFor="condition">
          <GlassSelect id="condition" required value={values.condition} onChange={(e) => setValues((v) => ({ ...v, condition: e.target.value }))}>
            <option value="NEW">NEW</option>
            <option value="GOOD">GOOD</option>
            <option value="FAIR">FAIR</option>
            <option value="WORN">WORN</option>
          </GlassSelect>
        </FormField>
      </div>

   <div className="grid grid-cols-2 gap-4">
  <FormField label="Quantity available" htmlFor="quantity" error={errors.quantity}>
    <div className="flex h-[46px] items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] transition-all duration-200 focus-within:border-[var(--color-accent)] focus-within:bg-[var(--color-accent-dim)] focus-within:ring-4 focus-within:ring-[var(--color-accent-dim)]">
      <button
        type="button"
        onClick={() => setValues((v) => ({ ...v, quantity: Math.max(1, Number(v.quantity || 1) - 1) }))}
        className="flex h-full items-center px-3 text-lg text-mid transition-colors hover:text-[var(--color-text-hi)]"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        id="quantity"
        type="number"
        min={1}
        required
        value={values.quantity}
        onChange={(e) => setValues((v) => ({ ...v, quantity: e.target.value }))}
        className="w-full border-0 bg-transparent px-1 text-center text-sm text-[var(--color-text-hi)] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => setValues((v) => ({ ...v, quantity: Number(v.quantity || 1) + 1 }))}
        className="flex h-full items-center px-3 text-lg text-mid transition-colors hover:text-[var(--color-text-hi)]"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  </FormField>
  <div />
</div>

      <FormField label="Description" htmlFor="description">
        <GlassTextarea id="description" required rows={4} value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} placeholder="Describe the item's condition, accessories included, and any borrowing notes…"/>
      </FormField>

      <FormField label="Phone Number *" htmlFor="phoneNumber" error={errors.phoneNumber}>
        <GlassInput
          id="phoneNumber"
          type="tel"
          required
          value={values.contact.phoneNumber}
          onChange={(e) => setContact("phoneNumber", e.target.value)}
          placeholder="e.g. +8801712345678"
        />
      </FormField>

      <FormField label="Social / Contact URL" htmlFor="socialUrl" error={errors.socialUrl}>
        <GlassInput
          id="socialUrl"
          type="url"
          value={values.contact.socialUrl}
          onChange={(e) => setContact("socialUrl", e.target.value)}
          placeholder="https://wa.me/8801712345678"
        />
      </FormField>

      <div className="flex gap-3">
        <Button type="submit" variant="primary" size="lg" disabled={submitting || uploading}>
          {submitting ? "Saving…" : mode === "create" ? "List item" : "Save changes"}
        </Button>
        <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>);
}