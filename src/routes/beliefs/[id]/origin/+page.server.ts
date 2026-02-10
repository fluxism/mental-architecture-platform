import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { beliefs, beliefOrigins } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const [belief] = await db
		.select()
		.from(beliefs)
		.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)))
		.limit(1);

	if (!belief) throw error(404, 'Belief not found');

	const origins = await db
		.select()
		.from(beliefOrigins)
		.where(eq(beliefOrigins.beliefId, params.id))
		.orderBy(beliefOrigins.createdAt);

	return { belief, origins };
};

export const actions: Actions = {
	answer: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const response = formData.get('response') as string;

		if (!response?.trim()) {
			return fail(400, { error: 'Please write something before saving.' });
		}

		await db.insert(beliefOrigins).values({
			id: nanoid(),
			beliefId: params.id,
			question: 'Open reflection',
			response: response.trim(),
			createdAt: new Date()
		});

		return { answered: true };
	},

	deleteOrigin: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const originId = formData.get('originId') as string;

		await db.delete(beliefOrigins).where(eq(beliefOrigins.id, originId));

		return { deleted: true };
	}
};
