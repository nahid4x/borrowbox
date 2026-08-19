import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema, passwordChangeSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireUser, requireAdmin } from "@/lib/api-guards";
export async function GET(_req, { params }) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { id } = await params;
    if (id !== session.user.id && session.user.role !== "ADMIN") {
        return jsonError("Forbidden", 403);
    }
    const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true, avatarUrl: true, createdAt: true, studentId: true },
    });
    if (!user)
        return jsonError("User not found", 404);
    return jsonOk(user);
}
// A user can update their own profile / password. Body may contain either
// profile fields or a password change — handled distinctly since password
// change requires verifying the current password.
export async function PATCH(req, { params }) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { id } = await params;
    if (id !== session.user.id && session.user.role !== "ADMIN") {
        return jsonError("Forbidden", 403);
    }
    const body = await req.json().catch(() => null);
    if (body?.currentPassword) {
        const parsed = passwordChangeSchema.safeParse(body);
        if (!parsed.success) {
            return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
        }
        const user = await prisma.user.findUniqueOrThrow({ where: { id } });
        const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
        if (!valid)
            return jsonError("Current password is incorrect", 400);
        const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
        await prisma.user.update({ where: { id }, data: { passwordHash } });
        return jsonOk({ updated: true });
    }
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    try {
        const updated = await prisma.user.update({
            where: { id },
            data: parsed.data,
            select: { id: true, name: true, email: true, role: true, avatarUrl: true, studentId: true },
        });
        return jsonOk(updated);
    }
    catch (err) {
        if (err.code === "P2002" && err.meta?.target?.includes("studentId")) {
            return jsonError("That student ID is already in use by another account", 409);
        }
        return jsonError("That email is already in use by another account", 409);
    }
}
// Admin-only: remove a user account.
export async function DELETE(_req, { params }) {
    const { error } = await requireAdmin();
    if (error)
        return error;
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return jsonOk({ deleted: true });
}
