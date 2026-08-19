# BorrowBox — UI Style Guide (v2, "Reading Room" dark glass system)

Design language extracted from NaraDrop (uploaded HTML + naradrop.vercel.app),
reinterpreted for a student borrowing platform. Priorities are the reverse of
NaraDrop's: NaraDrop is a cinematic utility for a single transfer session;
BorrowBox is a daily-use dashboard for browsing, listing, and tracking
borrows. So the same glass/blur/glow *materials* are kept, but usability,
scanability, and calm data density come first — motion and glow are turned
down and reserved for a few key moments.

---

## 1. Global theme

- Dark base, full-bleed video background (`background.mp4`) behind every
  screen, fixed and non-interactive, with a **static dark overlay at ~60%
  opacity** (NaraDrop uses a much lighter ~18% overlay + heavy video filters,
  because its content is sparse and centered; BorrowBox has dense tables,
  forms, and long item grids, so it needs a darker, quieter backdrop to stay
  readable — this is the single biggest deliberate deviation from the
  reference).
- No particle canvas, no animated background glows, no vignette breathing
  animation. The video itself provides ambience; we don't layer extra motion
  on top of it.
- If the video fails to load, fall back to a flat dark gradient using the
  same base colors — never a blank/white flash.

## 2. Color system (tokens)

Kept structurally identical to NaraDrop's token *shape* (same variable
categories), values tuned slightly warmer/less violet so BorrowBox doesn't
read as "the same app":

| Token | Value | Use |
|---|---|---|
| `--bg-0` / `--bg-1` / `--bg-2` | `#07080c` / `#0a0b11` / `#0d0e16` | Fallback background layers |
| `--glass` / `--glass-hi` | `rgba(255,255,255,0.035)` / `rgba(255,255,255,0.06)` | Card/panel fill |
| `--border` / `--border-hi` | `rgba(255,255,255,0.09)` / `rgba(255,255,255,0.18)` | Card/button borders, default vs hover |
| `--accent` / `--accent-light` | `#5b8fff` / `#8fb3ff` (blue, not violet) | Primary actions, links, focus |
| `--accent-glow` | `rgba(91,143,255,0.4)` | Glow — **reserved for primary actions only** (Borrow, Add Item, Approve) |
| `--text-hi` / `--text-mid` / `--text-low` | `#f5f6fa` / `rgba(235,237,245,.62)` / `rgba(235,237,245,.38)` | Text hierarchy |
| `--success` / `--success-dim` | `#6fe0a6` / `rgba(111,224,166,.14)` | Available, Approved, Returned |
| `--warn` / `--warn-dim` | `#f0b06c` / `rgba(240,176,108,.14)` | Pending |
| `--danger` / `--danger-dim` | `#f28b8b` / `rgba(242,139,139,.14)` | Rejected, Delete, Overdue |

Status colors map directly onto the existing `RequestStatus`/availability
badges — this replaces the "ink stamp" motif from v1 with a plain colored
pill (glow removed from status badges; glow is a scarce resource reserved
for the handful of primary-action buttons per screen).

## 3. Typography

- **Display/body**: Inter (400/500/600/700/800) — same as NaraDrop, it's
  already a clean, professional choice. Drop Fraunces/serif entirely — a
  student utility app should feel efficient, not editorial.
  Keep JetBrains Mono for genuinely tabular/code-like data — timestamps,
  ID.
- Scale (desktop, using NaraDrop's `clamp()` pattern):
  - Page hero H1: `clamp(28px, 4.5vw, 40px)`, weight 700, letter-spacing -0.03em
  - Section H2: `22px`, weight 700, letter-spacing -0.02em
  - Card title: `15px`, weight 600
  - Body: `14px`, weight 400, line-height 1.6
  - Eyebrow/label: `11px`, weight 600–700, letter-spacing 0.15em, uppercase, accent color
  - Stat value: `30px`, weight 700, letter-spacing -0.03em (NaraDrop's `.stat-value` pattern, reused for dashboard stat cards)

## 4. Component style

**Cards** (`.glass-card`): NaraDrop's card recipe kept close to verbatim in
*spirit* — `border-radius: 20px`, gradient glass fill, `1px` border,
`backdrop-filter: blur(28px) saturate(1.5)`, soft outer shadow. Hover lifts
`-2px` and brightens border only (no glow on hover — glow is reserved, see
below). The top hairline highlight (`::before` gradient line) is kept; it's
a subtle, non-distracting signature detail.

**Buttons** — three tiers, not one glowing style for everything:
- **Primary** (Borrow, Add Item, Approve, Save): solid accent gradient fill,
  dark text, permanent soft glow (`box-shadow` with `--accent-glow`),
  slightly stronger glow + `-2px` lift on hover. This is the *only* place
  glow lives by default.
- **Secondary/Ghost** (Cancel, Edit, filters): glass fill like cards, no
  glow ever, border brightens + `-1px` lift on hover only.
- **Destructive** (Delete, Reject): dim red glass fill, red text/border,
  red-tinted glow only on hover, never at rest — a rejection action
  shouldn't visually compete with approval actions.
- All buttons: `border-radius: 999px` (pill), consistent `12px 20px`
  padding, `13px/600` label. Disabled: `opacity: 0.35`, no transform, no
  shadow. Press state: `scale(0.96)`, faster transition.

**Inputs**: glass fill (not pure transparent), `14px` border-radius (not
full pill — forms need to feel distinct from buttons), border brightens +
soft accent-colored focus ring on focus (reuse NaraDrop's `.room-input:focus`
ring recipe at lower intensity). Floating label above the field, not
inside — clearer for dense forms like Add Item.

**Status badges**: solid-tinted pill, `12px` text, no border, no glow —
color alone (green/amber/red/gray) carries meaning, per the RequestStatus
enum.

**Navigation**: NaraDrop's pill-shaped floating top-nav (`border-radius:
999px`, glass, sticky with margin from top) is a strong, reusable idea —
but BorrowBox additionally needs a persistent **left sidebar** for a
multi-page dashboard (NaraDrop is single-page, so it only needed a top-nav).
Sidebar reuses the same glass-panel material as cards; nav item active
state uses a solid accent-tinted background (not glow) so the current page
is unambiguous.

## 5. Motion system

Deliberately quieter than NaraDrop, which animates cursor-follow glows,
particle drift, and letter-by-letter button labels — all fine for a landing
moment, wrong for a dashboard used dozens of times a day.

- Page/panel enter: single `fadeIn + translateY(8px)`, 0.3–0.4s, ease-out.
  No staggered per-element reveals.
  - No cursor-tracking radial highlight on buttons (NaraDrop's `--mx`/`--my`
    button glow) — costs performance for no real payoff at dashboard scale.
- Hover: transform + shadow only, 0.2–0.25s ease. No shine-sweep pseudo-
  element animations except on the 2–3 primary CTA buttons app-wide.
- Toasts: slide-in from the right, 0.3s spring, NaraDrop's toast recipe
  reused near-verbatim since it's already minimal and effective.
- Respect `prefers-reduced-motion` everywhere (already a hard rule from
  Phase 2; carried forward).

## 6. Layout system

- Persistent sidebar (240px) + topbar with search, unchanged in structure
  from Phase 2 — only re-skinned in the new material.
- Content max-width 1200px, `24px` page padding, `16–20px` gaps between
  cards, matching NaraDrop's generous whitespace.
- Item grid: 3-column desktop / 2-column tablet / 1-column mobile, same as
  Phase 2.

## 7. Icon usage

Continue with `lucide-react` (already in the stack) rather than NaraDrop's
hand-drawn inline SVGs — keeps icons consistent and maintainable across ~40
UI spots instead of one-off inline paths. Icon weight/size: 16–18px in
buttons and nav, 20–24px in empty states and feature call-outs, always
`currentColor` so they inherit text/accent color contextually.

## 8. Real-data & empty states

Every list/grid/stat now reads from the Phase 3 API instead of mock data.
Empty states follow NaraDrop's calm, non-apologetic tone:
- Items: "No items have been listed yet."
- Requests: "No borrow requests yet."
- Notifications: "You're all caught up."
No fabricated counts, names, or activity anywhere.

## 9. Responsive & accessibility

- Sidebar collapses to a bottom tab bar or slide-over below `1024px`
  (carried over from Phase 2's `lg:` breakpoint approach).
- All interactive elements keep visible `:focus-visible` rings (accent
  color, `2px`, `3px` offset — directly reused from NaraDrop, it's a good
  pattern).
- Color is never the only signal — status badges carry text labels, not
  just color, exactly as in Phase 2.
- Video background is `aria-hidden`, decorative only, and never blocks
  content in the accessibility tree.

---

## What's intentionally *not* being carried over from NaraDrop

- The full-screen "role select" landing gate — BorrowBox uses ordinary
  Login/Register pages, not a cinematic role-picker.
- Cursor-tracking glow, particle canvas, vignette breathing, letter-by-
  letter label animations, 3D cube logo spinner — all high-drama details
  suited to a one-time file-transfer moment, not a recurring dashboard.
- Session-code / room-code UI patterns — not applicable to BorrowBox's
  domain at all.

Waiting on your approval before touching any page code.
