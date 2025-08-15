
# AI Usage Log (sample template — replace with your actual prompts)

Document at least **6** prompts used during development. For each, include:
- **Goal / Context**
- **Prompt**
- **Output summary**
- **What changed in the code**

1) Goal: Pick stack + DB
Prompt: "Suggest a stack to build an auth + CRUD app with pagination"
Changes: Selected Next.js + Prisma + Postgres.

2) Goal: Design schema
Prompt: "Design a Prisma schema for Expense with enum + boolean and computed grandTotal"
Changes: Implemented `ExpenseCategory` enum and numeric fields.

3) Goal: Auth
Prompt: "Help me implement JWT auth using jose in Next.js app router"
Changes: Added routes and cookie-based JWT.

4) Goal: Pagination & filter
Prompt: "Implement server-side pagination + filter + search + sort with Prisma"
Changes: Query params and Prisma `where`/`orderBy` added.

5) Goal: UI polish
Prompt: "Tailwind form/table layout for expense manager"
Changes: Created form + table components.

6) Goal: OpenAPI spec
Prompt: "Draft OpenAPI 3.1 yaml for the endpoints"
Changes: Added `/docs/openapi.yaml`.
