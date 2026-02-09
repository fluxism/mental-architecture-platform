import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { extractBeliefsFromText } from '$lib/server/ai.js';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { text } = await request.json();
	if (!text || typeof text !== 'string') throw error(400, 'Text is required');

	const beliefs = await extractBeliefsFromText(text);
	return json({ beliefs });
};
