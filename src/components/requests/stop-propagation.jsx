"use client";

export function StopPropagation({ children }) {
  return <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>{children}</div>;
}