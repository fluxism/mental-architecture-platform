import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { assistOriginInquiry } from '$lib/server/ai.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { belief, existingResponses } = await request.json();
	if (!belief || typeof belief !== 'string') throw error(400, 'Belief is required');

	const reflection = await assistOriginInquiry(belief, existingResponses || []);
	return json({ reflection });
};
