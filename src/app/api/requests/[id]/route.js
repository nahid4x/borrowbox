import { prisma } from "@/lib/prisma";
import { requestActionSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";
import { NotificationType, RequestStatus } from "@prisma/client";
// State machine:
// PENDING --approve--> APPROVED --mark_borrowed--> BORROWED --mark_returned--> RETURNED
//    |--reject--> REJECTED
//    |--cancel--> CANCELLED   (borrower only, while PENDING)
//
// Authorization:
// - approve / reject / mark_borrowed / mark_returned: only the item's owner
// - cancel: only the borrower who created the request
//
// NOTE: Item.isAvailable is no longer toggled here. Unit availability is now
// derived dynamically (quantity minus active APPROVED/BORROWED requests) —
// see /api/requests POST and the item details page.
export async function PATCH(req, { params }) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = requestActionSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const request = await prisma.borrowRequest.findUnique({
        where: { id },
        include: { item: true },
    });
    if (!request)
        return jsonError("Request not found", 404);
    const userId = session.user.id;
    const isOwner = request.item.ownerId === userId;
    const isBorrower = request.borrowerId === userId;
    const { action } = parsed.data;
    const transitions = {
        approve: { from: RequestStatus.PENDING, to: RequestStatus.APPROVED, allowed: isOwner, notify: NotificationType.REQUEST_APPROVED },
        reject: { from: RequestStatus.PENDING, to: RequestStatus.REJECTED, allowed: isOwner, notify: NotificationType.REQUEST_REJECTED },
        mark_borrowed: { from: RequestStatus.APPROVED, to: RequestStatus.BORROWED, allowed: isOwner },
        mark_returned: { from: RequestStatus.BORROWED, to: RequestStatus.RETURNED, allowed: isOwner, notify: NotificationType.ITEM_RETURNED },
        cancel: { from: RequestStatus.PENDING, to: RequestStatus.CANCELLED, allowed: isBorrower },
    };
    const transition = transitions[action];
    if (!transition.allowed) {
        return jsonError("Forbidden — you can't perform this action on this request", 403);
    }
    if (request.status !== transition.from) {
        return jsonError(`Invalid transition: request is ${request.status}, expected ${transition.from}`, 409);
    }
    const updated = await prisma.$transaction(async (tx) => {
        const req = await tx.borrowRequest.update({
            where: { id },
            data: {
                status: transition.to,
                decidedAt: ["approve", "reject"].includes(action) ? new Date() : undefined,
                returnedAt: action === "mark_returned" ? new Date() : undefined,
            },
        });
        if (transition.notify) {
            await tx.notification.create({
                data: {
                    userId: request.borrowerId,
                    type: transition.notify,
                    message: `Your request for "${request.item.name}" was ${transition.to.toLowerCase()}`,
                    relatedRequestId: req.id,
                },
            });
        }
        return req;
    });
    return jsonOk(updated);
}