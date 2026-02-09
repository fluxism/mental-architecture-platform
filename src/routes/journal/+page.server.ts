import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { journalEntries } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const entries = await db
		.select()
		.from(journalEntries)
		.where(eq(journalEntries.userId, locals.user.id))
		.orderBy(desc(journalEntries.createdAt));

	return { entries };
};
