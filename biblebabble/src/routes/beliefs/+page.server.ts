import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { beliefs } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const allBeliefs = await db
		.select()
		.from(beliefs)
		.where(eq(beliefs.userId, locals.user.id))
		.orderBy(desc(beliefs.createdAt));

	return { beliefs: allBeliefs };
};
