import { PackageSearch } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ItemCard } from "@/components/items/item-card";
import { EmptyState } from "@/components/shared/empty-state";
import { BrowseFilters } from "@/components/items/browse-filters";

const CATEGORY_ORDER = [
  "Books",
  "Laptop",
  "Calculator",
  "Camera",
  "Mobile",
  "Charger",
  "Electronics",
  "Sports Equipment",
  "Others",
];

export default async function BrowseItemsPage({ searchParams }) {
  const { q, category, available } = await searchParams;
  const [categoriesRaw, items] = await Promise.all([
    prisma.category.findMany(),
    prisma.item.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
                { owner: { name: { contains: q, mode: Prisma.QueryMode.insensitive } } },
              ],
            }
          : {}),
        ...(category ? { category: { name: category } } : {}),
        ...(available === "true" ? { isAvailable: true } : {}),
      },
      include: { category: true, owner: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const categories = [...categoriesRaw].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Browse items</h1>
        <p className="text-sm text-mid">Find what your classmates are sharing right now.</p>
      </div>

      <BrowseFilters
        categories={categories.map((c) => c.name)}
        currentQuery={q ?? ""}
        currentCategory={category ?? null}
        onlyAvailable={available === "true"}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No items match your search"
          description="Try a different keyword, or clear your filters to see everything that's available."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}