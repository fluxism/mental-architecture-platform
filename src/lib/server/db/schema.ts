import { pgTable, text, boolean, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name'),
	gender: text('gender', { enum: ['male', 'female'] }),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const lifeVisions = pgTable('life_visions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title'),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: timestamp('expires_at').notNull()
});

export const journalEntries = pgTable('journal_entries', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	prompt: text('prompt'),
	aiInsights: text('ai_insights'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const beliefs = pgTable('beliefs', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	statement: text('statement').notNull(),
	status: text('status', { enum: ['active', 'shifting', 'integrated'] })
		.notNull()
		.default('active'),
	functionalBelief: text('functional_belief'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const beliefOrigins = pgTable('belief_origins', {
	id: text('id').primaryKey(),
	beliefId: text('belief_id')
		.notNull()
		.references(() => beliefs.id, { onDelete: 'cascade' }),
	question: text('question').notNull(),
	response: text('response').notNull(),
	createdAt: timestamp('created_at').notNull()
});

export const affirmations = pgTable('affirmations', {
	id: text('id').primaryKey(),
	beliefId: text('belief_id')
		.notNull()
		.references(() => beliefs.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	isAiGenerated: boolean('is_ai_generated').notNull().default(false),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const stories = pgTable('stories', {
	id: text('id').primaryKey(),
	beliefId: text('belief_id')
		.notNull()
		.references(() => beliefs.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title'),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const reflections = pgTable('reflections', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	beliefId: text('belief_id').references(() => beliefs.id, { onDelete: 'cascade' }),
	journalEntryId: text('journal_entry_id').references(() => journalEntries.id, {
		onDelete: 'cascade'
	}),
	content: text('content').notNull(),
	createdAt: timestamp('created_at').notNull()
});

export const journalEntryBeliefs = pgTable(
	'journal_entry_beliefs',
	{
		journalEntryId: text('journal_entry_id')
			.notNull()
			.references(() => journalEntries.id, { onDelete: 'cascade' }),
		beliefId: text('belief_id')
			.notNull()
			.references(() => beliefs.id, { onDelete: 'cascade' })
	},
	(table) => [primaryKey({ columns: [table.journalEntryId, table.beliefId] })]
);
