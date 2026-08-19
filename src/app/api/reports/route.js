import { prisma } from "@/lib/prisma";
import { reportCreateSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";

function generateReferenceCode() {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `BB-${year}-${rand}`;
}

export async function GET(req) {
    const { session, error } = await requireUser();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") ?? "mine";
    if (scope === "all" && session.user.role !== "ADMIN") {
        return jsonError("Forbidden — admin only", 403);
    }

    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const where = {
        ...(scope === "all" ? {} : { userId: session.user.id }),
        ...(category ? { category } : {}),
        ...(priority ? { priority } : {}),
        ...(status ? { status } : {}),
        ...(userId ? { userId } : {}),
    };

    const reports = await prisma.report.findMany({
        where,
        include: scope === "all" ? { user: { select: { id: true, name: true, email: true } } } : undefined,
        orderBy: { createdAt: "desc" },
    });
    return jsonOk(reports);
}

export async function POST(req) {
    const { session, error } = await requireUser();
    if (error) return error;

    const body = await req.json().catch(() => null);
    const parsed = reportCreateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }

    let referenceCode = generateReferenceCode();
    for (let i = 0; i < 3; i++) {
        const existing = await prisma.report.findUnique({ where: { referenceCode } });
        if (!existing) break;
        referenceCode = generateReferenceCode();
    }

    const report = await prisma.report.create({
        data: {
            referenceCode,
            userId: session.user.id,
            category: parsed.data.category,
            priority: parsed.data.priority,
            description: parsed.data.description,
            email: parsed.data.email,
            relatedItemId: parsed.data.relatedItemId ?? null,
            attachments: parsed.data.attachments,
        },
    });

    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
    });
    if (admins.length > 0) {
        await prisma.notification.createMany({
            data: admins.map((admin) => ({
                userId: admin.id,
                type: "REPORT_SUBMITTED",
                message: `New ${report.category.replaceAll("_", " ").toLowerCase()} report: ${report.referenceCode}`,
                relatedReportId: report.id,
            })),
        });
    }
    return jsonOk(report, 201);
}