import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	name: text('name'),
	gender: text('gender', { enum: ['male', 'female'] }),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const lifeVisions = sqliteTable('life_visions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title'),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const journalEntries = sqliteTable('journal_entries', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	prompt: text('prompt'),
	aiInsights: text('ai_insights'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const beliefs = sqliteTable('beliefs', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	statement: text('statement').notNull(),
	status: text('status', { enum: ['active', 'shifting', 'integrated'] })
		.notNull()
		.default('active'),
	functionalBelief: text('functional_belief'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const beliefOrigins = sqliteTable('belief_origins', {
	id: text('id').primaryKey(),
	beliefId: text('belief_id')
		.notNull()
		.references(() => beliefs.id, { onDelete: 'cascade' }),
	question: text('question').notNull(),
	response: text('response').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const affirmations = sqliteTable('affirmations', {
	id: text('id').primaryKey(),
	beliefId: text('belief_id')
		.notNull()
		.references(() => beliefs.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	content: text('content').notNull(),
	isAiGenerated: integer('is_ai_generated', { mode: 'boolean' }).notNull().default(false),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const stories = sqliteTable('stories', {
	id: text('id').primaryKey(),
	beliefId: text('belief_id')
		.notNull()
		.references(() => beliefs.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	title: text('title'),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const reflections = sqliteTable('reflections', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	beliefId: text('belief_id').references(() => beliefs.id, { onDelete: 'cascade' }),
	journalEntryId: text('journal_entry_id').references(() => journalEntries.id, {
		onDelete: 'cascade'
	}),
	content: text('content').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const journalEntryBeliefs = sqliteTable(
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
