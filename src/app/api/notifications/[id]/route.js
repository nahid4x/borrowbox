import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";
export async function PATCH(_req, { params }) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { id } = await params;
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification)
        return jsonError("Notification not found", 404);
    if (notification.userId !== session.user.id)
        return jsonError("Forbidden", 403);
    const updated = await prisma.notification.update({
        where: { id },
        data: { isRead: true },
    });
    return jsonOk(updated);
}
