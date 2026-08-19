import { prisma } from "@/lib/prisma";
import { requestCreateSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";
import { NotificationType, RequestStatus } from "@prisma/client";

export async function GET(req) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") ?? "mine";
    const itemId = searchParams.get("itemId");
    if (scope === "all" && session.user.role !== "ADMIN") {
        return jsonError("Forbidden — admin only", 403);
    }
    const where = {
        ...(scope === "all"
            ? {}
            : scope === "received"
                ? { item: { ownerId: session.user.id } }
                : { borrowerId: session.user.id }),
        ...(itemId ? { itemId } : {}),
    };
    const requests = await prisma.borrowRequest.findMany({
        where,
        include: {
            item: { include: { owner: { select: { id: true, name: true } } } },
            borrower: { select: { id: true, name: true } },
        },
        orderBy: { requestedAt: "desc" },
    });
    return jsonOk(requests);
}

export async function POST(req) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const body = await req.json().catch(() => null);
    const parsed = requestCreateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const item = await prisma.item.findUnique({ where: { id: parsed.data.itemId } });
    if (!item)
        return jsonError("Item not found", 404);
    if (item.ownerId === session.user.id) {
        return jsonError("You can't request to borrow your own item", 400);
    }
    if (!item.isAvailable) {
        return jsonError("This item is not currently available", 409);
    }
    const activeCount = await prisma.borrowRequest.count({
        where: {
            itemId: item.id,
            status: { in: [RequestStatus.APPROVED, RequestStatus.BORROWED] },
        },
    });
    if (activeCount >= item.quantity) {
        return jsonError("All units of this item are currently borrowed", 409);
    }
    const existingPending = await prisma.borrowRequest.findFirst({
        where: {
            itemId: item.id,
            borrowerId: session.user.id,
            status: RequestStatus.PENDING,
        },
    });
    if (existingPending) {
        return jsonError("You have already requested this item.", 409);
    }
    const request = await prisma.borrowRequest.create({
        data: {
            itemId: item.id,
            borrowerId: session.user.id,
            note: parsed.data.note,
        },
    });
    await prisma.notification.create({
        data: {
            userId: item.ownerId,
            type: NotificationType.REQUEST_RECEIVED,
            message: `${session.user.name} requested to borrow "${item.name}"`,
            relatedRequestId: request.id,
        },
    });
    return jsonOk(request, 201);
}