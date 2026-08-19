import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[42%_58%]">
      <div className="flex items-stretch px-4 py-4 sm:px-6">
        <div
          className="flex w-full flex-col justify-center rounded-[24px] border p-14"
          style={{
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            background: "rgba(15, 23, 42, 0.35)",
            borderColor: "rgba(255,255,255,0.12)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <Link href="/" className="mark mb-12 flex items-center gap-2.5">
            <div className="spinner">
              <div /><div /><div /><div /><div /><div />
            </div>
            <span className="text-xl font-bold tracking-tight">BorrowBox</span>
          </Link>
          {children}
        </div>
      </div>

<div className="relative hidden flex-col justify-center px-14 md:flex">
  <div className="mx-auto max-w-xl">
    <span
      className="inline-block w-fit rounded-[var(--radius-pill)] border border-[var(--color-border)] px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-light)]"
      style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
    >
      Simple. Reliable. Organized.
    </span>
    <p
      className="mt-6 text-4xl font-bold leading-tight tracking-tight"
      style={{ textShadow: "0 2px 16px rgba(0,0,0,0.6)" }}
    >
      Borrow with confidence.
      <br />
      Return without reminders.
    </p>
    <p
      className="mt-4 max-w-sm text-sm text-mid"
      style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}
    >
      Manage shared items in one place, see who has what, and always know when it&apos;s due back.
    </p>
  </div>
</div>
    </div>
  );
}