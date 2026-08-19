import { prisma } from "@/lib/prisma";
import { jsonOk, requireAdmin } from "@/lib/api-guards";
export async function DELETE(_req, { params }) {
    const { error } = await requireAdmin();
    if (error)
        return error;
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return jsonOk({ deleted: true });
}
