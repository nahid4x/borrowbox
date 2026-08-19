import { prisma } from "@/lib/prisma";
import { reportUpdateSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireAdmin, requireUser } from "@/lib/api-guards";

export async function GET(_req, { params }) {
    const { session, error } = await requireUser();
    if (error) return error;

    const { id } = await params;
    const report = await prisma.report.findUnique({
        where: { id },
        include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!report) return jsonError("Report not found", 404);
    if (report.userId !== session.user.id && session.user.role !== "ADMIN") {
        return jsonError("Forbidden", 403);
    }
    return jsonOk(report);
}

export async function PATCH(req, { params }) {
    const { session, error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const parsed = reportUpdateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }

    const report = await prisma.report.findUnique({ where: { id } });
    if (!report) return jsonError("Report not found", 404);

    const updated = await prisma.report.update({
        where: { id },
        data: {
            status: parsed.data.status,
            ...(parsed.data.adminReply !== undefined ? { adminReply: parsed.data.adminReply, respondedAt: new Date() } : {}),
        },
    });

   const statusLabel = parsed.data.status.replaceAll("_", " ").toLowerCase();
    await prisma.notification.create({
        data: {
            userId: report.userId,
            type: "REPORT_STATUS_UPDATED",
            message: parsed.data.adminReply
                ? `Support replied to your report ${report.referenceCode}`
                : `Your report ${report.referenceCode} is now ${statusLabel}`,
            relatedReportId: report.id,
        },
    });

    return jsonOk(updated);
}