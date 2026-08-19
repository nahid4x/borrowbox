import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { jsonError, jsonOk } from "@/lib/api-guards";
import { Role } from "@prisma/client";
export async function POST(req) {
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const { name, email, studentId, password } = parsed.data;
    const existing = await prisma.user.findFirst({
        where: { OR: [{ email }, { studentId }] },
    });
    if (existing) {
        return jsonError(existing.email === email
            ? "An account with this email already exists"
            : "An account with this student ID already exists", 409);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // New self-registrations are always STUDENT. ADMIN accounts are seeded
    // or promoted directly by an existing admin — never through open signup.
    const user = await prisma.user.create({
        data: { name, email, studentId, passwordHash, role: Role.STUDENT },
        select: { id: true, name: true, email: true, studentId: true, role: true },
    });
    return jsonOk(user, 201);
}
