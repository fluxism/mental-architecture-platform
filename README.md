# MAP — Mental Architecture Platform

A belief-mapping and transformation system disguised as a journaling app. MAP helps people dismantle negative beliefs at the root — not through surface-level positivity, but through honest expression, origin tracing, AI-assisted reframing, and mythical storytelling.

## What It Does

MAP guides users through a structured inner-work process:

1. **Express** — Freeform journaling with optional prompts. No judgment, no forced positivity. Just honest articulation of emotions, struggles, and recurring thoughts.

2. **Identify** — AI extracts limiting beliefs from journal entries (e.g. "I'm not enough", "People always leave"). Users build a living belief list they can edit, rephrase, and track over time.

3. **Trace the Origin** — For each belief, guided inquiry helps users explore where it came from: childhood memories, inherited messages, protective mechanisms. The goal is context, not blame.

4. **Transform** — AI generates a functional replacement belief and personalized affirmations that directly counter the specific belief and its origin. Users edit everything until it feels true and grounded.

5. **Sacred Parables** — AI creates mythical, archetypal stories tailored to the user's specific wounds and growth. These speak to the subconscious through symbolism, reframing the user as a character who overcomes and transforms.

6. **Life Vision** — A first-person narrative of who the user is becoming, generated from their full belief landscape — wounds, transformations, and all.

7. **Timeline** — A chronological record of journal entries, beliefs, affirmations, stories, and reflections. Users can see their inner evolution over time.

## Belief Lifecycle

Beliefs move through three states:

- **Active** — Currently shaping the user's life
- **Shifting** — Being questioned and transformed
- **Integrated** — Understood and no longer a limiting force

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5 with runes)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4 — grayscale palette with warm accents
- **Database**: [Neon PostgreSQL](https://neon.tech/) via `@netlify/neon`
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) with `drizzle-kit` for migrations
- **AI**: [OpenAI](https://openai.com/) (GPT) — belief extraction, origin reflection, functional belief generation, affirmation writing, story creation, life vision generation
- **Auth**: Custom session-based authentication (PBKDF2 password hashing, SHA-256 session tokens, 30-day sessions with auto-refresh)
- **Deployment**: [Netlify](https://www.netlify.com/) with `adapter-netlify`
- **Runtime**: [Bun](https://bun.sh/)

## Project Structure

```
src/
├── routes/
│   ├── auth/              # Login, register, logout
│   ├── dashboard/         # Overview with stats and recent entries
│   ├── journal/           # Freeform writing, AI insights, belief extraction
│   │   ├── new/           # New journal entry
│   │   └── [id]/          # View/edit entry, add reflections
│   ├── beliefs/           # Belief list and management
│   │   ├── new/           # Add a belief (manual or from journal)
│   │   └── [id]/          # Belief detail
│   │       ├── origin/    # Origin tracing inquiry
│   │       ├── transform/ # Functional belief + affirmations
│   │       └── story/     # Sacred parables generation
│   ├── vision/            # Life vision generation and management
│   ├── timeline/          # Chronological inner journey view
│   ├── profile/           # User profile and password change
│   └── admin/             # Admin dashboard and user management
├── lib/
│   ├── server/
│   │   ├── db/
│   │   │   ├── schema.ts  # Drizzle schema (PostgreSQL)
│   │   │   └── index.ts   # Lazy DB connection via Proxy
│   │   └── auth.ts        # Session management and password hashing
│   └── components/        # Shared Svelte components
└── routes/api/ai/         # AI endpoints
    ├── extract-beliefs/   # Extract limiting beliefs from text
    ├── origin-inquiry/    # Reflective questions about belief origins
    ├── generate-functional-belief/  # Transform negative -> functional belief
    ├── generate-affirmation/        # Personalized affirmations
    ├── generate-story/    # Sacred parables / mythical narratives
    └── generate-vision/   # Life vision generation
```

## Database Schema

| Table | Purpose |
|---|---|
| `users` | Accounts with email, password, name, gender, date/place of birth, role |
| `sessions` | Session-based auth with expiry |
| `journal_entries` | Freeform writing with optional AI insights |
| `beliefs` | Limiting beliefs with status tracking and functional replacements |
| `belief_origins` | Origin inquiry responses tied to beliefs |
| `affirmations` | Personalized affirmations (AI-generated or user-written) |
| `stories` | Sacred parables / mythical narratives |
| `reflections` | Later insights on journal entries or beliefs |
| `life_visions` | First-person vision narratives |
| `journal_entry_beliefs` | Links between journal entries and extracted beliefs |

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun run dev

# Type checking
bun run check

# Build for production
bun run build
```

## Database Migrations

The app uses Drizzle ORM with Neon PostgreSQL. Schema changes should be safe and additive:

```bash
# Generate a migration from schema changes
bunx drizzle-kit generate

# Apply migrations
bunx drizzle-kit migrate
```

Never use `drizzle-kit push` for destructive changes (dropping columns/tables, altering types). Always review generated migration files before applying.
