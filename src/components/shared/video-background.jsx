/**
 * Fullscreen atmosphere layer. Fixed behind all content, decorative only.
 * Falls back to a flat dark gradient if the video can't load, so the app
 * never shows a blank or broken frame.
 */
export function VideoBackground() {
    return (<div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[var(--color-bg-1)] to-[var(--color-bg-0)]">
      <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto">
        <source src="/videos/background.mp4" type="video/mp4"/>
      </video>
      {/* Dark overlay — kept at 60% per the style guide, since BorrowBox's
            dense tables and forms need more contrast than a sparse landing
            page would. */}
      <div className="absolute inset-0 bg-black/60"/>
    </div>);
}
