import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
/**
 * The single card primitive used everywhere — dashboard stat tiles, item
 * cards, form panels, table containers. Every surface in the app should be
 * built from this rather than one-off glass CSS, so a future tweak to the
 * material only has to happen in one place.
 *
 * Pass `href` to render the card as a navigable link — it gets pointer
 * cursor, lift-on-hover, glow, and a subtle scale automatically.
 */
export function GlassCard({ className, hoverable = false, href, children, ...props }) {
    const classes = cn(
        "glass-surface glass-hairline rounded-[var(--radius-xl)] p-5 transition-all duration-300",
        (hoverable || href) && "cursor-pointer hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_24px_var(--color-accent-dim)]",
        className
    );

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (<div className={classes} {...props}>
      {children}
    </div>);
}