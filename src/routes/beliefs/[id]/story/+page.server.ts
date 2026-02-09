import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { beliefs, beliefOrigins, stories } from '$lib/server/db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

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

	const beliefStories = await db
		.select()
		.from(stories)
		.where(eq(stories.beliefId, params.id))
		.orderBy(desc(stories.createdAt));

	return { belief, origins, stories: beliefStories };
};

export const actions: Actions = {
	saveStory: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!content?.trim()) return fail(400, { error: 'Story content is required.' });

		const now = new Date();
		await db.insert(stories).values({
			id: nanoid(),
			beliefId: params.id,
			userId: locals.user.id,
			title: title?.trim() || null,
			content: content.trim(),
			createdAt: now,
			updatedAt: now
		});

		return { storySaved: true };
	},

	updateStory: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const storyId = formData.get('storyId') as string;
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!content?.trim()) return fail(400, { error: 'Story content is required.' });

		await db
			.update(stories)
			.set({ title: title?.trim() || null, content: content.trim(), updatedAt: new Date() })
			.where(and(eq(stories.id, storyId), eq(stories.userId, locals.user.id)));

		return { storyUpdated: true };
	},

	deleteStory: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const storyId = formData.get('storyId') as string;

		await db
			.delete(stories)
			.where(and(eq(stories.id, storyId), eq(stories.userId, locals.user.id)));

		return { deleted: true };
	}
};
