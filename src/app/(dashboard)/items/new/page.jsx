import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/items/item-form";

export default async function AddItemPage() {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    const sortedCategories = [
        ...categories.filter((c) => c.name !== "Others"),
        ...categories.filter((c) => c.name === "Others"),
    ];
    return (<div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight">List a new item</h1>
      <p className="mt-1 text-sm text-mid">Share something you own with fellow students.</p>
      <ItemForm mode="create" categories={sortedCategories}/>
    </div>);
}