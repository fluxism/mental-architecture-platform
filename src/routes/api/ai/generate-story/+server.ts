import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { generateMythicStory } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const profile = await buildUserProfile(locals.user.id);
	const story = await generateMythicStory(profile);
	return json(story);
};
