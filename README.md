# BorrowBox

A Student Item Borrowing Management System — built for SE322 coursework.
Students list items they're not using; other students request to borrow them.
Two roles: **ADMIN** (moderation, user management) and **STUDENT** (list
items, send/receive borrow requests — ownership is per-item via `ownerId`,
not a separate role).

See [`PHASE1_PLANNING.md`](./PHASE1_PLANNING.md) for architecture/ERD/API
design, and [`DESIGN_STYLE_GUIDE.md`](./DESIGN_STYLE_GUIDE.md) for the
dark-glass design system.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma ORM ·
PostgreSQL · Auth.js v5 (Credentials) · Zod · React Hook Form

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `DATABASE_URL` — point at your PostgreSQL instance
   - `AUTH_SECRET` — generate one with `npx auth secret`

3. **Generate the Prisma client and set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```
   The seed script creates:
   - Admin: `admin@borrowbox.diu.edu.bd` / `Admin@12345`
   - Students (all use `Student@12345`): `anisa.rahman@diu.edu.bd`,
     `tanvir.ahmed@diu.edu.bd`, `farhana.islam@diu.edu.bd`,
     `rifat.karim@diu.edu.bd`, `nusrat.jahan@diu.edu.bd`
   - 9 categories and 4 sample items

4. **Run the dev server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

## Notes on this build environment

This project was built in a sandboxed environment without access to
`fonts.googleapis.com` or `binaries.prisma.sh`. That affects two things:

- **Fonts** (`Inter`, `JetBrains Mono`) are loaded via a plain CSS `@import`
  in `globals.css` rather than `next/font/google`. Works fine as-is; switch
  to `next/font/google` for self-hosted fonts once you have normal internet
  access during `next build`.
- **Prisma client generation** (`npm run db:generate`) needs to download a
  query engine binary from `binaries.prisma.sh` — this could not be run in
  the sandbox, so the full app (every page that queries the database)
  could not be built end-to-end here. What *was* verified in-sandbox:
  - `npx tsc --noEmit` against a temporary type stub for `@prisma/client`
    surfaced zero real bugs — every remaining error traced back to the
    stub being looser than Prisma's real generated types (e.g. enums like
    `Role`/`RequestStatus` are runtime objects in the real client, not just
    TS types).
  - `npx eslint src` — clean, no warnings.
  - `npm run build` — Turbopack compiles the entire app successfully; it
    only stops at the Prisma-generate step, which is expected here.

  Run `npm run db:generate` (with real internet access) before your first
  `npm run dev` or `npm run build`.

## Project structure

```
prisma/
  schema.prisma      Database schema
  seed.ts             Seed data
public/
  videos/background.mp4   Global atmosphere video
src/
  app/
    (auth)/           Login, Register
    (dashboard)/       Dashboard, Items, My Items, Requests, Notifications,
                        Profile, Admin, Settings — protected by proxy.ts
    api/                REST endpoints (auth, items, requests, users,
                        categories, notifications, dashboard/stats)
    loading.tsx / error.tsx / not-found.tsx
  components/
    ui/                 Button, GlassCard, GlassInput/Select/Textarea
    shared/             Sidebar, Topbar, VideoBackground, StatusBadge,
                        EmptyState, Skeletons, NotificationRow
    items/ requests/ profile/ admin/   Feature-specific components
  lib/                 prisma client, auth.ts, validations.ts, api-guards.ts
  proxy.ts             Route protection + admin-only gating (Next.js 16
                        renamed "middleware.ts" to "proxy.ts")
```

## Authorization rules

- Only the item's owner (`ownerId`) can edit or delete their own item, or an Admin (moderation).
- Only the borrower who created a request can cancel it (while `PENDING`).
- Only the item's owner can approve, reject, or mark a request borrowed/returned.
- Only Admin can manage all users, all items, and moderate listings.

## Borrow request lifecycle

```
PENDING --approve--> APPROVED --mark_borrowed--> BORROWED --mark_returned--> RETURNED
   |--reject--> REJECTED
   |--cancel--> CANCELLED   (borrower only, while PENDING)
```

## Design system

Dark glassmorphism theme inspired by NaraDrop's visual language (not
copied — see `DESIGN_STYLE_GUIDE.md`). Full-screen `background.mp4` behind
every page with a 60% dark overlay for readability. Accent glow is reserved
for primary actions (Borrow, Add Item, Approve, Save) — everything else
uses plain glass surfaces with no glow. All real data — no fake users,
items, or statistics anywhere; empty states are shown when there's nothing
to display yet.

## Current status

- ✅ Phase 1 — Planning & architecture
- ✅ Phase 2 — Initial UI/UX (later fully re-themed, see Phase 3.5)
- ✅ Phase 3 — Backend: Prisma schema, Auth.js, RBAC middleware, all API routes
- ✅ Phase 3.5 — Full UI re-theme to dark glassmorphism + real-data wiring
  (17 pages: Landing, Login, Register, Dashboard, Browse Items, Item
  Details, Add Item, Edit Item, My Items, Borrow Requests, Notifications,
  Profile, Admin Dashboard, Settings, Loading, Error, 404)
- ⬜ Phase 4 — Testing & optimization
- ⬜ Phase 5 — Academic documentation
- ⬜ Phase 6 — Final packaging
