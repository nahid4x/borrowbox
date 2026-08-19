import { prisma } from "@/lib/prisma";
import { categoryCreateSchema } from "@/lib/validations";
import { jsonError, jsonOk, requireAdmin } from "@/lib/api-guards";
export async function GET() {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return jsonOk(categories);
}
export async function POST(req) {
    const { error } = await requireAdmin();
    if (error)
        return error;
    const body = await req.json().catch(() => null);
    const parsed = categoryCreateSchema.safeParse(body);
    if (!parsed.success) {
        return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    }
    const category = await prisma.category.create({ data: parsed.data });
    return jsonOk(category, 201);
}
