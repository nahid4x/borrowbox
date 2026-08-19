import { prisma } from "@/lib/prisma";
import { jsonOk, requireAdmin } from "@/lib/api-guards";
export async function GET() {
    const { error } = await requireAdmin();
    if (error)
        return error;
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
            _count: { select: { items: true, requests: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return jsonOk(users);
}
