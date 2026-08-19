import * as React from "react";
import { cn } from "@/lib/utils";
export const GlassInput = React.forwardRef(({ className, ...props }, ref) => (<input ref={ref} className={cn("w-full max-w-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] px-3.5 py-3 text-sm text-[var(--color-text-hi)] outline-none placeholder:text-[var(--color-text-low)] transition-all duration-200 focus:border-[var(--color-accent)] focus:bg-[var(--color-accent-dim)] focus:ring-4 focus:ring-[var(--color-accent-dim)]", className)} {...props}/>));
GlassInput.displayName = "GlassInput";
export const GlassTextarea = React.forwardRef(({ className, ...props }, ref) => (<textarea ref={ref} className={cn("w-full max-w-sm resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] px-3.5 py-3 text-sm text-[var(--color-text-hi)] outline-none placeholder:text-[var(--color-text-low)] transition-all duration-200 focus:border-[var(--color-accent)] focus:bg-[var(--color-accent-dim)] focus:ring-4 focus:ring-[var(--color-accent-dim)]", className)} {...props}/>));
GlassTextarea.displayName = "GlassTextarea";
export const GlassSelect = React.forwardRef(({ className, children, ...props }, ref) => (<select ref={ref} className={cn("w-full max-w-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-glass)] px-3.5 py-3 text-sm text-[var(--color-text-hi)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent-dim)]", className)} {...props}>
    {children}
  </select>));
GlassSelect.displayName = "GlassSelect";
/**
 * Field wrapper — label sits above the control (clearer for dense forms
 * than an inside-the-box floating label, per the style guide).
 */
export function FormField({ label, htmlFor, hint, error, children, }) {
    return (<div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[var(--color-text-hi)]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-low">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-[var(--color-danger)]">{error}</p>}
    </div>);
}