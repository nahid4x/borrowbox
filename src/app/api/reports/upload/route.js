import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";

const ALLOWED_TYPES = [
  "image/jpeg", "image/png", "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain",
];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(req) {
    const { error } = await requireUser();
    if (error) return error;

    const formData = await req.formData().catch(() => null);
    const file = formData?.get("file");
    if (!file || !(file instanceof File)) {
        return jsonError("No file provided", 422);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return jsonError("Only PNG, JPG, JPEG, WEBP, PDF, DOCX, or TXT files are allowed", 422);
    }
    if (file.size > MAX_SIZE) {
        return jsonError("File must be under 20MB", 422);
    }

    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const filename = `${randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "reports");
    await mkdir(uploadDir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));

    return jsonOk({ url: `/uploads/reports/${filename}`, name: file.name, type: file.type, size: file.size });
}