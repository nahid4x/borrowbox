import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
/**
 * Three-tier button system (see DESIGN_STYLE_GUIDE.md §4):
 *  - primary   — the one glowing tier, reserved for the main action on a
 *                screen (Borrow, Add Item, Approve, Save).
 *  - secondary — glass surface, no glow ever, just a border/lift on hover.
 *  - ghost     — same as secondary but transparent at rest, for low-emphasis
 *                actions inside toolbars.
 *  - destructive — dim red glass at rest; glow only appears on hover, never
 *                permanently, so it doesn't compete visually with primary.
 */
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-35 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.96]", {
    variants: {
        variant: {
            primary: "bg-gradient-to-r from-[var(--color-accent-light)] to-[var(--color-accent)] text-[#0a0e1a] shadow-[0_10px_28px_var(--color-accent-glow)] hover:shadow-[0_14px_36px_var(--color-accent-glow)] hover:-translate-y-0.5",
            secondary: "glass-surface text-[var(--color-text-hi)] hover:-translate-y-0.5",
            ghost: "bg-transparent text-[var(--color-text-mid)] hover:bg-[var(--color-glass)] hover:text-[var(--color-text-hi)]",
            destructive: "bg-[var(--color-danger-dim)] border border-[rgba(242,139,139,0.28)] text-[var(--color-danger)] hover:shadow-[0_10px_28px_rgba(242,139,139,0.3)] hover:-translate-y-0.5",
            link: "text-[var(--color-accent-light)] underline-offset-4 hover:underline",
        },
        size: {
            default: "h-10 px-5 py-2",
            sm: "h-8 px-3.5 text-xs",
            lg: "h-12 px-6 text-base",
            icon: "h-9 w-9",
        },
    },
    defaultVariants: { variant: "secondary", size: "default" },
});
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}/>);
});
Button.displayName = "Button";
export { Button, buttonVariants };
