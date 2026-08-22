import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  const { error } = await requireUser();
  if (error) return error;

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return jsonError("No file provided", 422);
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return jsonError("Only JPEG, PNG, WEBP, or GIF images are allowed", 422);
  }

  if (file.size > MAX_SIZE) {
    return jsonError("File must be under 5MB", 422);
  }

  const ext = file.type.split("/")[1];
  const filename = `avatars/${randomUUID()}.${ext}`;

  try {
    const blob = await put(filename, file, {
      access: "public",
    });

    return jsonOk({ url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    return jsonError("Upload failed", 500);
  }
}