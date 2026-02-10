# CLAUDE.md — Project Rules

## Database Safety

**NEVER perform destructive database operations.** There is live user data in production (Neon PostgreSQL via Netlify).

- Never use `drizzle-kit push` for changes that drop columns, drop tables, or alter types in breaking ways
- Always use safe, additive migrations (add columns, add tables, add indexes)
- For any schema change that could lose data, use `drizzle-kit generate` to create a migration file, review it manually, and apply with `drizzle-kit migrate`
- Never run `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, or `DELETE` without explicit user confirmation
- When adding columns, always make them nullable or provide a default to avoid breaking existing rows
