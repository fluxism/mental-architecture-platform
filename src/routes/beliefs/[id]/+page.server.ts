import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import {
	beliefs,
	beliefOrigins,
	affirmations,
	stories,
	reflections
} from '$lib/server/db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const belief = await db
		.select()
		.from(beliefs)
		.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)))
		.get();

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

	const beliefStories = await db
		.select()
		.from(stories)
		.where(eq(stories.beliefId, params.id))
		.orderBy(desc(stories.createdAt));

	const beliefReflections = await db
		.select()
		.from(reflections)
		.where(eq(reflections.beliefId, params.id))
		.orderBy(desc(reflections.createdAt));

	return {
		belief,
		origins,
		affirmations: beliefAffirmations,
		stories: beliefStories,
		reflections: beliefReflections
	};
};

export const actions: Actions = {
	updateStatement: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const statement = formData.get('statement') as string;

		if (!statement?.trim()) return fail(400, { error: 'Statement cannot be empty.' });

		await db
			.update(beliefs)
			.set({ statement: statement.trim(), updatedAt: new Date() })
			.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)));

		return { updated: true };
	},

	updateStatus: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const status = formData.get('status') as string;

		if (!['active', 'shifting', 'integrated'].includes(status)) {
			return fail(400, { error: 'Invalid status.' });
		}

		await db
			.update(beliefs)
			.set({ status: status as 'active' | 'shifting' | 'integrated', updatedAt: new Date() })
			.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)));

		return { statusUpdated: true };
	},

	updateFunctionalBelief: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const functionalBelief = formData.get('functionalBelief') as string;

		await db
			.update(beliefs)
			.set({ functionalBelief: functionalBelief?.trim() || null, updatedAt: new Date() })
			.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)));

		return { beliefUpdated: true };
	},

	delete: async ({ locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		await db
			.delete(beliefs)
			.where(and(eq(beliefs.id, params.id), eq(beliefs.userId, locals.user.id)));

		throw redirect(302, '/beliefs');
	},

	addReflection: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const content = formData.get('content') as string;

		if (!content?.trim()) return fail(400, { reflectionError: 'Reflection cannot be empty.' });

		const { nanoid } = await import('nanoid');
		await db.insert(reflections).values({
			id: nanoid(),
			userId: locals.user.id,
			beliefId: params.id,
			content: content.trim(),
			createdAt: new Date()
		});

		return { reflectionAdded: true };
	}
};
