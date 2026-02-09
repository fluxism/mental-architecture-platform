import { redirect, fail, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { beliefs, beliefOrigins } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const ORIGIN_QUESTIONS = [
	'When do you remember first feeling this? Is there a specific age or moment?',
	'Is there a specific memory attached to this belief? What happened?',
	'Did someone say or imply this to you? Who?',
	'Did you infer this belief from an experience, or was it told to you directly?',
	'Does the origin feel clear, vague, or completely forgotten?',
	'What emotion is most tied to this belief? Where do you feel it in your body?',
	'How did this belief once try to protect you? What was it keeping you safe from?',
	'If this belief had a voice, whose voice would it sound like?'
];

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

	const answeredQuestions = new Set(origins.map((o) => o.question));
	const remainingQuestions = ORIGIN_QUESTIONS.filter((q) => !answeredQuestions.has(q));

	return { belief, origins, remainingQuestions, allQuestions: ORIGIN_QUESTIONS };
};

export const actions: Actions = {
	answer: async ({ request, locals, params }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const question = formData.get('question') as string;
		const response = formData.get('response') as string;

		if (!question || !response?.trim()) {
			return fail(400, { error: 'Please write a response.' });
		}

		await db.insert(beliefOrigins).values({
			id: nanoid(),
			beliefId: params.id,
			question,
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
