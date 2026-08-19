import { prisma } from "@/lib/prisma";
import { itemCreateSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireUser } from "@/lib/api-guards";
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category");
    const available = searchParams.get("available");
    const condition = searchParams.get("condition");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 12)));
    const where = {
        ...(q
            ? {
                OR: [
                    { name: { contains: q, mode: "insensitive" } },
                    { description: { contains: q, mode: "insensitive" } },
                    { owner: { name: { contains: q, mode: "insensitive" } } },
                ],
            }
            : {}),
        ...(category ? { category: { name: category } } : {}),
        ...(available !== null && available !== undefined
            ? { isAvailable: available === "true" }
            : {}),
        ...(condition ? { condition: condition } : {}),
    };
    const [items, total] = await Promise.all([
        prisma.item.findMany({
            where,
            include: { owner: { select: { id: true, name: true } }, category: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.item.count({ where }),
    ]);
    return jsonOk({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
}
export async function POST(req) {
    const { session, error } = await requireUser();
    if (error)
        return error;
    const body = await req.json().catch(() => null);
    const parsed = itemCreateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const item = await prisma.item.create({
        data: { ...parsed.data, ownerId: session.user.id },
        include: { category: true },
    });
    return jsonOk(item, 201);
}
