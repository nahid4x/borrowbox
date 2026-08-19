import { Button } from "@/components/ui/button";
/**
 * Calm, non-apologetic empty state — used whenever an API call returns no
 * records. Never replaced with fake/sample data (see DESIGN_STYLE_GUIDE.md
 * §8 and PHASE1_PLANNING.md).
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, }) {
    return (<div className="glass-surface flex flex-col items-center justify-center rounded-[var(--radius-xl)] border-dashed py-16 px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-glass-hi)]">
        <Icon className="h-6 w-6 text-low"/>
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-hi)]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-mid">{description}</p>
      {actionLabel && (<Button variant="primary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>)}
    </div>);
}
