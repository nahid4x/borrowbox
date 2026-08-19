import { prisma } from "@/lib/prisma";
import { jsonOk, requireUser } from "@/lib/api-guards";
export async function GET() {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    return jsonOk(notifications);
}
