import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { journalEntries } from '$lib/server/db/schema.js';
import { nanoid } from 'nanoid';

const PROMPTS = [
	'What feels heavy right now?',
	'What keeps repeating in your mind?',
	'What are you afraid to say out loud?',
	'What would you tell yourself if no one was listening?',
	'What do you wish someone understood about you?',
	'What pattern do you keep falling into?',
	'What are you holding onto that no longer serves you?'
];

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
	return { prompt: randomPrompt, prompts: PROMPTS };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const content = formData.get('content') as string;
		const prompt = formData.get('prompt') as string;

		if (!content || content.trim().length === 0) {
			return fail(400, { error: 'Please write something before saving.' });
		}

		const now = new Date();
		const id = nanoid();

		await db.insert(journalEntries).values({
			id,
			userId: locals.user.id,
			content: content.trim(),
			prompt: prompt || null,
			createdAt: now,
			updatedAt: now
		});

		throw redirect(302, `/journal/${id}`);
	}
};
