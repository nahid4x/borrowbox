import { prisma } from "@/lib/prisma";
import { itemUpdateSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";
export async function GET(_req, { params }) {
    const { id } = await params;
    const item = await prisma.item.findUnique({
        where: { id },
        include: { owner: { select: { id: true, name: true } }, category: true },
    });
    if (!item)
        return jsonError("Item not found", 404);
    return jsonOk(item);
}
// Only the item's owner (ownerId) can edit their own item — or an Admin
// performing moderation.
export async function PATCH(req, { params }) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { id } = await params;
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item)
        return jsonError("Item not found", 404);
    const isOwner = item.ownerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin)
        return jsonError("Forbidden — not your item", 403);
    const body = await req.json().catch(() => null);
    const parsed = itemUpdateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const updated = await prisma.item.update({
        where: { id },
        data: parsed.data,
        include: { category: true },
    });
    return jsonOk(updated);
}
// Only the item's owner can delete their own item — or an Admin removing an
// inappropriate listing.
export async function DELETE(_req, { params }) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { id } = await params;
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item)
        return jsonError("Item not found", 404);
    const isOwner = item.ownerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin)
        return jsonError("Forbidden — not your item", 403);
    await prisma.item.delete({ where: { id } });
    return jsonOk({ deleted: true });
}
