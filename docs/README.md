
# AI Campus Assignment — Expenses App

A minimal full-stack app meeting the assignment requirements: auth, CRUD with enum/boolean/calculated field, listing with pagination + filter (+sorting & search). Built with Next.js (App Router), Prisma, and PostgreSQL.

## Tech choices (why)
- **Next.js 14 + React**: one repo for UI + APIs, easy deploy on Vercel.
- **Prisma + PostgreSQL (Neon)**: schema-first, migrations, free serverless Postgres on Neon.
- **JWT in HttpOnly cookie**: simple username/password auth without heavy SDKs.
- **Tailwind** for quick, clean UI.

## Entity (CRUD)
- **Expense** with fields:
  - `description` (text)
  - `category` (enum: TRAVEL, FOOD, OFFICE, OTHER)
  - `reimbursable` (boolean)
  - `amount` (number), `taxRate` (number)
  - **`grandTotal`** = `amount + (amount * taxRate / 100)` — calculated server-side and returned by the API.

## Local setup

1) Install deps
```bash
pnpm i # or npm i or yarn
```

2) Create a free Postgres on [Neon](https://neon.tech) and copy the connection string.  
Create `.env` by copying `.env.example` and paste your string into `DATABASE_URL`. Also set a strong `JWT_SECRET`.

3) Generate Prisma client + create DB schema
```bash
npx prisma migrate dev --name init
```

4) Run the app
```bash
npm run dev
# http://localhost:3000
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. In Vercel, **Import Project** → pick the repo.
3. Add env vars: `DATABASE_URL`, `JWT_SECRET`, `AUTH_COOKIE`.
4. Build & deploy. Ensure Neon DB is **Region close to Vercel** for latency.

## API (summary)

- `POST /api/auth/register` — create account
- `POST /api/auth/login` — set JWT cookie
- `POST /api/auth/logout` — clear cookie
- `GET /api/auth/session` — current user

- `GET /api/expenses?page=1&pageSize=5&category=FOOD&reimbursable=true&search=taxi&sort=amount:desc`
- `POST /api/expenses` — create
- `GET /api/expenses/:id` — read
- `PUT /api/expenses/:id` — update
- `DELETE /api/expenses/:id` — delete

> Pagination = 5 by default; filtering by category/reimbursable; **bonus**: sorting + search included.

## How this maps to assignment
- Auth (username/password) ✅
- CRUD with text/enum/boolean/calculated field ✅
- Listing with pagination + filter (+sorting, +search) ✅
- Docs in `/docs` and OpenAPI spec ✅

## Run tests (manual suggestions)
- Validation: empty description, wrong enum/category, negative amount.
- Boundary: pageSize=1 and 10, taxRate=0/100.
- Security: call /api/expenses without login → 401.

## Useful commands
```bash
# regenerate client after schema change
npm run prisma:generate

# create a new migration
npm run prisma:migrate
```
