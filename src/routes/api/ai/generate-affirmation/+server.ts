import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { generateAffirmation } from '$lib/server/ai.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { belief, origins, functionalBelief } = await request.json();
	if (!belief || typeof belief !== 'string') throw error(400, 'Belief is required');

	const affirmation = await generateAffirmation(belief, origins || [], functionalBelief);
	return json({ affirmation });
};
