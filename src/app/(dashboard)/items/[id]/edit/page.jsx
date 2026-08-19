import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/items/item-form";
export default async function EditItemPage({ params, }) {
    const { id } = await params;
    const session = await auth();
    const [item, categories] = await Promise.all([
        prisma.item.findUnique({ where: { id } }),
        prisma.category.findMany({ orderBy: { name: "asc" } }),
    ]);
    if (!item)
        notFound();
    // Only the item's owner can edit — everyone else gets redirected back to
    // the (read-only) detail page rather than seeing a form they can't submit.
    if (item.ownerId !== session.user.id)
        redirect(`/items/${id}`);
    return (<div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">Edit item</h1>
      <p className="mt-1 text-sm text-mid">Update your listing details.</p>
      <ItemForm mode="edit" itemId={item.id} categories={categories} initialValues={{
            name: item.name,
            description: item.description,
            categoryId: item.categoryId,
            condition: item.condition,
        }}/>
    </div>);
}
