import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { journalEntries, beliefs } from '$lib/server/db/schema.js';
import { eq, desc, count } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		redirect(302, '/auth/login');
	}

	const userId = event.locals.user.id;

	const recentEntries = await db
		.select({
			id: journalEntries.id,
			content: journalEntries.content,
			prompt: journalEntries.prompt,
			createdAt: journalEntries.createdAt
		})
		.from(journalEntries)
		.where(eq(journalEntries.userId, userId))
		.orderBy(desc(journalEntries.createdAt))
		.limit(5);

	const totalEntriesResult = await db
		.select({ count: count() })
		.from(journalEntries)
		.where(eq(journalEntries.userId, userId));

	const beliefsByStatus = await db
		.select({
			status: beliefs.status,
			count: count()
		})
		.from(beliefs)
		.where(eq(beliefs.userId, userId))
		.groupBy(beliefs.status);

	const totalEntries = totalEntriesResult[0]?.count ?? 0;

	const beliefCounts = {
		active: 0,
		shifting: 0,
		integrated: 0
	};

	for (const row of beliefsByStatus) {
		if (row.status in beliefCounts) {
			beliefCounts[row.status as keyof typeof beliefCounts] = row.count;
		}
	}

	return {
		recentEntries,
		totalEntries,
		beliefCounts,
		totalBeliefs: beliefCounts.active + beliefCounts.shifting + beliefCounts.integrated
	};
};
