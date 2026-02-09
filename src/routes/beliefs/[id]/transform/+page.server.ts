import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { beliefs, beliefOrigins, affirmations } from '$lib/server/db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
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

	const beliefAffirmations = await db
		.select()
		.from(affirmations)
		.where(eq(affirmations.beliefId, params.id))
		.orderBy(desc(affirmations.createdAt));

	return { belief, origins, affirmations: beliefAffirmations };
};

export const actions: Actions = {
	updateFunctionalBelief: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const functionalBelief = formData.get('functionalBelief') as string;

		await db
			.update(beliefs)
			.set({ functionalBelief: functionalBelief?.trim() || null, updatedAt: new Date() })
			.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)));

		return { saved: true };
	},

	addAffirmation: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const content = formData.get('content') as string;
		const isAiGenerated = formData.get('isAiGenerated') === 'true';

		if (!content?.trim()) return fail(400, { affirmationError: 'Affirmation cannot be empty.' });

		const now = new Date();
		await db.insert(affirmations).values({
			id: nanoid(),
			beliefId: params.id,
			userId: locals.user.id,
			content: content.trim(),
			isAiGenerated,
			createdAt: now,
			updatedAt: now
		});

		return { affirmationAdded: true };
	},

	deleteAffirmation: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const affirmationId = formData.get('affirmationId') as string;

		await db
			.delete(affirmations)
			.where(and(eq(affirmations.id, affirmationId), eq(affirmations.userId, locals.user.id)));

		return { deleted: true };
	}
};
