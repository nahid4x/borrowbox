import { prisma } from "@/lib/prisma";
import { jsonOk, requireUser } from "@/lib/api-guards";
import { RequestStatus } from "@prisma/client";
export async function GET() {
    const { session, error } = await requireUser();
    if (error)
        return error;
    if (session.user.role === "ADMIN") {
        const [totalUsers, totalItems, borrowedItems, returnedItems, pendingRequests] = await Promise.all([
            prisma.user.count(),
            prisma.item.count(),
            prisma.borrowRequest.count({ where: { status: RequestStatus.BORROWED } }),
            prisma.borrowRequest.count({ where: { status: RequestStatus.RETURNED } }),
            prisma.borrowRequest.count({ where: { status: RequestStatus.PENDING } }),
        ]);
        return jsonOk({ totalUsers, totalItems, borrowedItems, returnedItems, pendingRequests });
    }
    const userId = session.user.id;
    const [itemsListed, itemsBorrowed, pendingRequests, returnedItems] = await Promise.all([
        prisma.item.count({ where: { ownerId: userId } }),
        prisma.borrowRequest.count({ where: { borrowerId: userId } }),
        prisma.borrowRequest.count({ where: { borrowerId: userId, status: RequestStatus.PENDING } }),
        prisma.borrowRequest.count({ where: { borrowerId: userId, status: RequestStatus.RETURNED } }),
    ]);
    return jsonOk({ itemsListed, itemsBorrowed, pendingRequests, returnedItems });
}
