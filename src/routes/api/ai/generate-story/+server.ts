import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { streamMythicStory } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	try {
		const profile = await buildUserProfile(locals.user.id);
		const stream = await streamMythicStory(profile);

		return new Response(stream, {
			headers: { 'Content-Type': 'text/plain; charset=utf-8' }
		});
	} catch (e: any) {
		if (e?.status) throw e;
		console.error('Story generation failed:', e);
		throw error(500, 'Failed to generate story. Please try again.');
	}
};
