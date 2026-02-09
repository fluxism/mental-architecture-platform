import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import {
	journalEntries,
	journalEntryBeliefs,
	beliefs,
	reflections
} from '$lib/server/db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { generateJournalInsights } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const [entry] = await db
		.select()
		.from(journalEntries)
		.where(and(eq(journalEntries.id, params.id), eq(journalEntries.userId, locals.user.id)))
		.limit(1);

	if (!entry) throw error(404, 'Entry not found');

	const linkedBeliefs = await db
		.select({ belief: beliefs })
		.from(journalEntryBeliefs)
		.innerJoin(beliefs, eq(journalEntryBeliefs.beliefId, beliefs.id))
		.where(eq(journalEntryBeliefs.journalEntryId, params.id));

	const entryReflections = await db
		.select()
		.from(reflections)
		.where(eq(reflections.journalEntryId, params.id))
		.orderBy(desc(reflections.createdAt));

	return {
		entry,
		linkedBeliefs: linkedBeliefs.map((r) => r.belief),
		reflections: entryReflections
	};
};

export const actions: Actions = {
	update: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content || content.trim().length === 0) {
			return fail(400, { error: 'Content cannot be empty.' });
		}

		await db
			.update(journalEntries)
			.set({ content: content.trim(), updatedAt: new Date() })
			.where(and(eq(journalEntries.id, params.id), eq(journalEntries.userId, locals.user.id)));

		return { success: true };
	},

	delete: async ({ locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		await db
			.delete(journalEntries)
			.where(and(eq(journalEntries.id, params.id), eq(journalEntries.userId, locals.user.id)));

		throw redirect(302, '/journal');
	},

	generateInsights: async ({ locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const [entry] = await db
			.select()
			.from(journalEntries)
			.where(and(eq(journalEntries.id, params.id), eq(journalEntries.userId, locals.user.id)))
			.limit(1);

		if (!entry) throw error(404, 'Entry not found');

		const profile = await buildUserProfile(locals.user.id);
		const insights = await generateJournalInsights(entry.content, profile);

		await db
			.update(journalEntries)
			.set({ aiInsights: insights, updatedAt: new Date() })
			.where(eq(journalEntries.id, params.id));

		return { insightsGenerated: true };
	},

	addReflection: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content || content.trim().length === 0) {
			return fail(400, { reflectionError: 'Reflection cannot be empty.' });
		}

		await db.insert(reflections).values({
			id: nanoid(),
			userId: locals.user.id,
			journalEntryId: params.id,
			content: content.trim(),
			createdAt: new Date()
		});

		return { reflectionAdded: true };
	}
};
