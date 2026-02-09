import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { assistOriginInquiry } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { belief, existingResponses } = await request.json();
	if (!belief || typeof belief !== 'string') throw error(400, 'Belief is required');

	const profile = await buildUserProfile(locals.user.id);
	const reflection = await assistOriginInquiry(profile, belief, existingResponses || []);
	return json({ reflection });
};
