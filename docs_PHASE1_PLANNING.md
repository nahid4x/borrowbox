# BorrowBox — Phase 1: Planning & Architecture

## 1. Project Summary
BorrowBox is a student item borrowing management platform where students (Owners) list items
they're willing to lend, other students (Borrowers) request to borrow them, and Admins oversee
the whole system. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui,
Prisma, PostgreSQL, and Auth.js.

## 2. System Architecture

```
                        ┌─────────────────────┐
                        │   Client (Browser)   │
                        │  Next.js App Router  │
                        │  React Server/Client │
                        │      Components      │
                        └──────────┬───────────┘
                                   │ HTTPS
                        ┌──────────▼───────────┐
                        │   Next.js Server      │
                        │  - Route Handlers     │
                        │    (/app/api/**)      │
                        │  - Server Actions     │
                        │  - Auth.js middleware │
                        │  - Zod validation     │
                        └──────────┬───────────┘
                                   │ Prisma Client
                        ┌──────────▼───────────┐
                        │     PostgreSQL        │
                        │  users / items /      │
                        │  categories /         │
                        │  borrow_requests /     │
                        │  notifications /       │
                        │  activity_logs         │
                        └───────────────────────┘
```

Cross-cutting layers:
- **Middleware**: route protection by role (`middleware.ts`), redirects unauthenticated/unauthorized users.
- **Validation**: all mutation inputs pass through Zod schemas shared between client (React Hook Form resolver) and server (route handler re-validation).
- **Service layer**: `/src/server/services/*` — business logic isolated from route handlers (e.g. `borrowRequestService.approve()`), so route handlers stay thin.
- **Activity logging**: key mutations (approve, reject, delete, return) write to `activity_logs` for the admin reports view.

## 3. Entity-Relationship Design (ERD)

```
┌───────────────┐        ┌────────────────┐        ┌──────────────┐
│     User       │        │      Item       │        │   Category    │
├───────────────┤        ├────────────────┤        ├──────────────┤
│ id (PK)        │───┐    │ id (PK)         │   ┌───▶│ id (PK)       │
│ name           │   │    │ name            │   │    │ name          │
│ email (unique) │   │    │ description     │   │    └──────────────┘
│ passwordHash   │   │    │ condition       │   │
│ role (enum)    │   │    │ imageUrl        │   │
│ avatarUrl      │   └───▶│ ownerId (FK)    │───┘
│ createdAt      │        │ categoryId (FK) │
└───────┬───────┘        │ isAvailable     │
        │                │ createdAt       │
        │                └────────┬────────┘
        │                         │
        │                         │
        │                ┌────────▼────────┐
        │                │  BorrowRequest   │
        │                ├─────────────────┤
        └───────────────▶│ id (PK)          │
        (borrowerId FK)  │ itemId (FK)      │
                          │ borrowerId (FK)  │
                          │ status (enum)    │
                          │ requestedAt      │
                          │ approvedAt       │
                          │ returnedAt       │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │   Notification    │
                          ├───────────────────┤
                          │ id (PK)            │
                          │ userId (FK)        │
                          │ type               │
                          │ message            │
                          │ isRead             │
                          │ createdAt          │
                          └───────────────────┘

                          ┌───────────────────┐
                          │   ActivityLog      │
                          ├───────────────────┤
                          │ id (PK)            │
                          │ userId (FK)        │
                          │ action             │
                          │ targetType         │
                          │ targetId           │
                          │ createdAt          │
                          └───────────────────┘
```

Relationships:
- `User (1) —— (N) Item` via `ownerId`
- `User (1) —— (N) BorrowRequest` via `borrowerId`
- `Item (1) —— (N) BorrowRequest` via `itemId`
- `Category (1) —— (N) Item` via `categoryId`
- `User (1) —— (N) Notification` via `userId`
- `User (1) —— (N) ActivityLog` via `userId`

## 4. Prisma Schema (draft)

```prisma
enum Role {
  ADMIN
  OWNER
  BORROWER
}

enum ItemCondition {
  NEW
  GOOD
  FAIR
  WORN
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
  BORROWED
  RETURNED
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  passwordHash  String
  role          Role      @default(BORROWER)
  avatarUrl     String?
  items         Item[]
  requests      BorrowRequest[]
  notifications Notification[]
  activityLogs  ActivityLog[]
  createdAt     DateTime  @default(now())
}

model Category {
  id    String @id @default(cuid())
  name  String @unique
  items Item[]
}

model Item {
  id          String         @id @default(cuid())
  name        String
  description String
  condition   ItemCondition  @default(GOOD)
  imageUrl    String?
  isAvailable Boolean        @default(true)
  owner       User           @relation(fields: [ownerId], references: [id])
  ownerId     String
  category    Category       @relation(fields: [categoryId], references: [id])
  categoryId  String
  requests    BorrowRequest[]
  createdAt   DateTime       @default(now())
}

model BorrowRequest {
  id          String        @id @default(cuid())
  item        Item          @relation(fields: [itemId], references: [id])
  itemId      String
  borrower    User          @relation(fields: [borrowerId], references: [id])
  borrowerId  String
  status      RequestStatus @default(PENDING)
  requestedAt DateTime      @default(now())
  approvedAt  DateTime?
  returnedAt  DateTime?
}

model Notification {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  type      String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model ActivityLog {
  id         String   @id @default(cuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  action     String
  targetType String
  targetId   String
  createdAt  DateTime @default(now())
}
```

## 5. Roles & Permission Matrix

| Feature                  | Admin | Owner | Borrower |
|---------------------------|:-----:|:-----:|:--------:|
| View dashboard stats       | ✅    | ➖    | ➖       |
| Manage users (CRUD)        | ✅    | ➖    | ➖       |
| Manage all items           | ✅    | ➖    | ➖       |
| Add/edit/delete own item   | ➖    | ✅    | ➖       |
| Browse & search items      | ✅    | ✅    | ✅       |
| Send borrow request        | ➖    | ➖    | ✅       |
| Approve/reject request     | ✅    | ✅ (own items) | ➖ |
| Mark item returned         | ✅    | ✅ (own items) | ➖ |
| Cancel own request         | ➖    | ➖    | ✅       |
| View own borrow history    | ➖    | ➖    | ✅       |
| View reports               | ✅    | ➖    | ➖       |

Note: a user can hold the OWNER or BORROWER role and still perform the other's read actions
(everyone can browse items); the matrix above reflects *write* actions.

## 6. API Endpoints

```
Auth
  POST   /api/auth/register
  POST   /api/auth/[...nextauth]        (Auth.js — login/logout/session)

Users (admin only, except /me)
  GET    /api/users
  GET    /api/users/me
  PATCH  /api/users/me
  PATCH  /api/users/:id/role
  DELETE /api/users/:id

Categories
  GET    /api/categories
  POST   /api/categories                (admin)
  DELETE /api/categories/:id            (admin)

Items
  GET    /api/items            (query: search, category, status, page)
  POST   /api/items                     (owner)
  GET    /api/items/:id
  PATCH  /api/items/:id                 (owner of item / admin)
  DELETE /api/items/:id                 (owner of item / admin)

Borrow Requests
  GET    /api/requests          (scoped to role: mine as borrower / mine as owner / all as admin)
  POST   /api/requests                  (borrower)
  PATCH  /api/requests/:id/approve      (owner/admin)
  PATCH  /api/requests/:id/reject       (owner/admin)
  PATCH  /api/requests/:id/return       (owner/admin)
  PATCH  /api/requests/:id/cancel       (borrower)

Notifications
  GET    /api/notifications/me
  PATCH  /api/notifications/:id/read

Dashboard / Reports
  GET    /api/dashboard/stats           (admin)
```

## 7. Folder Structure

```
borrowbox/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx            (dashboard stats)
│   │   │   │   ├── users/page.tsx
│   │   │   │   ├── items/page.tsx
│   │   │   │   └── reports/page.tsx
│   │   │   ├── items/
│   │   │   │   ├── page.tsx            (browse/search/filter)
│   │   │   │   ├── [id]/page.tsx       (item detail)
│   │   │   │   ├── new/page.tsx        (owner: add item)
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── requests/page.tsx       (my requests / incoming requests)
│   │   │   ├── profile/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/...
│   │   │   ├── users/...
│   │   │   ├── items/...
│   │   │   ├── requests/...
│   │   │   ├── categories/...
│   │   │   └── notifications/...
│   │   ├── layout.tsx
│   │   └── page.tsx                    (landing page)
│   ├── components/
│   │   ├── ui/                         (shadcn primitives)
│   │   ├── items/
│   │   ├── requests/
│   │   ├── dashboard/
│   │   └── shared/                     (navbar, sidebar, empty-state, etc.)
│   ├── server/
│   │   ├── services/                   (itemService, requestService, userService)
│   │   ├── auth.ts                     (Auth.js config)
│   │   └── db.ts                       (Prisma client singleton)
│   ├── lib/
│   │   ├── validations/                (Zod schemas)
│   │   └── utils.ts
│   ├── hooks/
│   └── middleware.ts
├── public/
├── .env.example
├── README.md
└── package.json
```

## 8. Development Phases (from here)
- Phase 2: UI/UX — build pages/components against this structure with shadcn/ui.
- Phase 3: Wire up Prisma + Auth.js + all CRUD/API routes.
- Phase 4: Testing, validation, error handling.
- Phase 5: Academic documentation.
- Phase 6: README, seed data, ZIP package, PDF report.
