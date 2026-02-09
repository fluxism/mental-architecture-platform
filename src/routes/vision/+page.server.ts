import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { lifeVisions, beliefs } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const visions = await db
		.select()
		.from(lifeVisions)
		.where(eq(lifeVisions.userId, locals.user.id))
		.orderBy(desc(lifeVisions.createdAt));

	const allBeliefs = await db
		.select()
		.from(beliefs)
		.where(eq(beliefs.userId, locals.user.id));

	return { visions, allBeliefs };
};

export const actions: Actions = {
	save: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!content?.trim()) return fail(400, { error: 'Vision content is required.' });

		const now = new Date();
		await db.insert(lifeVisions).values({
			id: nanoid(),
			userId: locals.user.id,
			title: title?.trim() || null,
			content: content.trim(),
			createdAt: now,
			updatedAt: now
		});

		return { saved: true };
	},

	update: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const visionId = formData.get('visionId') as string;
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		if (!content?.trim()) return fail(400, { error: 'Vision content is required.' });

		await db
			.update(lifeVisions)
			.set({ title: title?.trim() || null, content: content.trim(), updatedAt: new Date() })
			.where(eq(lifeVisions.id, visionId));

		return { updated: true };
	},

	delete: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const visionId = formData.get('visionId') as string;

		await db.delete(lifeVisions).where(eq(lifeVisions.id, visionId));

		return { deleted: true };
	}
};
