# MAP - Mental Architecture Platform - Implementation Plan

## Tech Stack
- **Framework**: SvelteKit + Svelte 5 (runes)
- **Database**: SQLite via better-sqlite3 + Drizzle ORM
- **Auth**: Custom session auth following Lucia guide (@oslojs/crypto, @oslojs/encoding)
- **Styling**: Tailwind CSS v4
- **AI**: OpenAI API (GPT-5.2)
- **Package Manager**: bun

## Database Schema (Drizzle/SQLite)

### users
- `id` text PK (nanoid)
- `email` text UNIQUE NOT NULL
- `passwordHash` text NOT NULL
- `name` text
- `createdAt` integer (unix timestamp)
- `updatedAt` integer

### sessions
- `id` text PK
- `userId` text FK → users.id
- `expiresAt` integer NOT NULL

### journal_entries
- `id` text PK
- `userId` text FK → users.id
- `content` text NOT NULL
- `prompt` text (nullable - which prompt was used)
- `aiInsights` text (nullable)
- `createdAt` integer
- `updatedAt` integer

### beliefs
- `id` text PK
- `userId` text FK → users.id
- `statement` text NOT NULL (e.g. "I am not enough")
- `status` text DEFAULT 'active' (active | shifting | integrated)
- `functionalBelief` text (nullable - the reframed version)
- `createdAt` integer
- `updatedAt` integer

### belief_origins
- `id` text PK
- `beliefId` text FK → beliefs.id
- `question` text NOT NULL
- `response` text NOT NULL
- `createdAt` integer

### affirmations
- `id` text PK
- `beliefId` text FK → beliefs.id
- `userId` text FK → users.id
- `content` text NOT NULL
- `isAiGenerated` integer (0/1)
- `createdAt` integer
- `updatedAt` integer

### stories
- `id` text PK
- `beliefId` text FK → beliefs.id
- `userId` text FK → users.id
- `title` text
- `content` text NOT NULL
- `createdAt` integer
- `updatedAt` integer

### reflections
- `id` text PK
- `userId` text FK → users.id
- `beliefId` text (nullable FK)
- `journalEntryId` text (nullable FK)
- `content` text NOT NULL
- `createdAt` integer

### journal_entry_beliefs (junction)
- `journalEntryId` text FK
- `beliefId` text FK
- PK: composite(journalEntryId, beliefId)

## Route Structure

```
src/routes/
├── +layout.svelte              # Root layout (nav, auth state)
├── +layout.server.ts           # Load session/user for all pages
├── +page.svelte                # Landing page
├── auth/
│   ├── login/+page.svelte + .server.ts
│   ├── register/+page.svelte + .server.ts
│   └── logout/+page.server.ts
├── dashboard/
│   └── +page.svelte + .server.ts
├── journal/
│   ├── +page.svelte + .server.ts         # List
│   ├── new/+page.svelte + .server.ts     # Create
│   └── [id]/+page.svelte + .server.ts    # View/edit
├── beliefs/
│   ├── +page.svelte + .server.ts         # List
│   ├── new/+page.svelte + .server.ts     # Create
│   └── [id]/
│       ├── +page.svelte + .server.ts     # Detail (tabs)
│       ├── origin/+page.svelte + .server.ts
│       ├── transform/+page.svelte + .server.ts
│       └── story/+page.svelte + .server.ts
├── timeline/+page.svelte + .server.ts
└── api/ai/
    ├── extract-beliefs/+server.ts
    ├── generate-affirmation/+server.ts
    ├── generate-story/+server.ts
    └── origin-inquiry/+server.ts
```

## Library Files

```
src/lib/
├── server/
│   ├── db/
│   │   ├── index.ts        # Drizzle client
│   │   └── schema.ts       # All table definitions
│   ├── auth.ts             # Session mgmt (Lucia patterns)
│   └── ai.ts               # OpenAI client + prompt templates
├── components/
│   ├── Nav.svelte
│   ├── BeliefCard.svelte
│   ├── JournalEntry.svelte
│   ├── StoryViewer.svelte
│   ├── AffirmationCard.svelte
│   ├── StatusBadge.svelte
│   ├── OriginQuestion.svelte
│   └── TimelineItem.svelte
└── types.ts
```

## Build Phases

### Phase 1: Infrastructure
- Install deps (drizzle-orm, better-sqlite3, @oslojs/crypto, @oslojs/encoding, openai, tailwindcss, nanoid)
- Configure Tailwind CSS v4
- Drizzle schema + config + client
- Create .env for OPENAI_API_KEY + session secrets
- Run db:push to create tables

### Phase 2: Authentication
- Session management utilities (token gen, validation, cookies)
- hooks.server.ts (session validation middleware)
- app.d.ts (Locals types for user/session)
- Register page + form action
- Login page + form action
- Logout action
- Auth guard helper

### Phase 3: UI Shell
- Tailwind base styles (dark, reflective aesthetic)
- Root layout with nav
- Landing page
- Dashboard page
- Protected route redirects

### Phase 4: Journal Module
- Journal list page
- New entry page (with guided prompts)
- View/edit entry page
- Delete functionality
- AI belief extraction integration

### Phase 5: Belief System
- Beliefs list with status filters
- Add/edit/delete beliefs
- Belief detail page with sub-navigation
- Origin inquiry flow (guided questions UI)
- Belief reframing + functional belief
- Affirmation builder (manual + AI)

### Phase 6: AI Integration
- OpenAI client with prompt engineering
- Extract beliefs endpoint
- Generate affirmation endpoint
- Generate story endpoint
- Origin inquiry assistance endpoint
- Wire into UI with loading states

### Phase 7: Mythic Stories
- Story viewer with special styling
- Generate from belief context
- Regenerate/refine
- Edit stories

### Phase 8: Timeline & Reflections
- Chronological timeline
- Add reflections to beliefs/entries
- Status progression tracking

### Phase 9: Polish
- Loading states, transitions
- Error handling, empty states
- Responsive design
- Aesthetic refinement
