import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { beliefs, journalEntryBeliefs } from '$lib/server/db/schema.js';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	return {
		prefillStatement: url.searchParams.get('statement') || '',
		entryId: url.searchParams.get('entryId') || null
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const statement = formData.get('statement') as string;
		const entryId = formData.get('entryId') as string;

		if (!statement || statement.trim().length === 0) {
			return fail(400, { error: 'Please enter a belief statement.' });
		}

		const now = new Date();
		const id = nanoid();

		await db.insert(beliefs).values({
			id,
			userId: locals.user.id,
			statement: statement.trim(),
			status: 'active',
			createdAt: now,
			updatedAt: now
		});

		if (entryId) {
			await db.insert(journalEntryBeliefs).values({
				journalEntryId: entryId,
				beliefId: id
			});
		}

		throw redirect(302, `/beliefs/${id}`);
	}
};
