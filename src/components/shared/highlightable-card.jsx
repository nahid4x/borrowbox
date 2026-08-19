"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function HighlightableCard({ id, className, children }) {
  const searchParams = useSearchParams();
  const highlight = searchParams.get("highlight");
  const isHighlighted = highlight === id;
  const ref = useRef(null);

  useEffect(() => {
    if (isHighlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        isHighlighted && "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-bg,transparent)] animate-pulse-once"
      )}
    >
      {children}
    </div>
  );
}