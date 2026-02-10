import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { generateMythicStory } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';

export const POST: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	try {
		const profile = await buildUserProfile(locals.user.id);
		const story = await generateMythicStory(profile);

		if (!story.content) {
			throw error(500, 'Story generation returned empty content');
		}

		return json(story);
	} catch (e: any) {
		if (e?.status) throw e;
		console.error('Story generation failed:', e);
		throw error(500, 'Failed to generate story. Please try again.');
	}
};
