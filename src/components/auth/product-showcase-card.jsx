"use client";
import Image from "next/image";
const items = [
    { image: "/items/textbook.jpg", name: "Data Structures Textbook", category: "Books", available: true },
    { image: "/items/laptop.jpg", name: "Dell XPS 13", category: "Electronics", available: true },
    { image: "/items/calculator.jpg", name: "Scientific Calculator", category: "Tools", available: false },
    { image: "/items/camera.jpg", name: "Canon DSLR", category: "Electronics", available: true },
    { image: "/items/headphones.jpg", name: "Sony WH-1000XM4", category: "Audio", available: true },
];
export function ProductShowcaseCard() {
    return (<div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-2xl">
      <div className="mb-3 px-1">
        <p className="text-xs font-medium text-blue-300">What's available right now</p>
      </div>

      <div className="space-y-2">
        {items.map((item) => (<div key={item.name} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/[0.07]">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px"/>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{item.name}</p>
              <p className="text-xs text-white/50">{item.category}</p>
            </div>

            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${item.available
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-white/10 text-white/40"}`}>
              {item.available ? "Available" : "Borrowed"}
            </span>

            <button disabled={!item.available} className="shrink-0 rounded-full bg-blue-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30">
              Borrow
            </button>
          </div>))}
      </div>
    </div>);
}
