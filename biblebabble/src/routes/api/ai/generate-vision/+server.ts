import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { generateLifeVision } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const profile = await buildUserProfile(locals.user.id);
	const vision = await generateLifeVision(profile);
	return json(vision);
};
