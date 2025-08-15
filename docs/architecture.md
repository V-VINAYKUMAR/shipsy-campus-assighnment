
# Architecture

## High level
- **Next.js App Router**: UI pages and API routes in the same project.
- **Auth**: Custom JWT signed with HS256, stored in HttpOnly cookie (`AUTH_COOKIE`).
- **DB**: PostgreSQL (Neon). Access via Prisma.

## Data model
```
User (id, username, passwordHash, createdAt)
Expense (id, description, category, reimbursable, amount, taxRate, createdAt, updatedAt, userId -> User)
```
- `grandTotal` is calculated on the server: `amount + (amount * taxRate / 100)`.

## Module breakdown
- `src/app/*` UI pages
- `src/app/api/*` API routes
- `src/lib/db.ts` Prisma client singleton
- `src/lib/jwt.ts` sign/verify JWT, cookie name

## Sequence: Create Expense
1. UI posts to `POST /api/expenses` with payload.
2. API validates + reads user from JWT cookie.
3. Prisma inserts row with `userId`.
4. API returns expense with computed `grandTotal`.
