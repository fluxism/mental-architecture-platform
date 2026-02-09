import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { generateMythicStory } from '$lib/server/ai.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { belief, origins, functionalBelief } = await request.json();
	if (!belief || typeof belief !== 'string') throw error(400, 'Belief is required');

	const story = await generateMythicStory(belief, origins || [], functionalBelief);
	return json(story);
};
