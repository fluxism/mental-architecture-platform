import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { assistOriginInquiry } from '$lib/server/ai.js';
import { buildUserProfile } from '$lib/server/profile.js';
import { db } from '$lib/server/db/index.js';
import { beliefs } from '$lib/server/db/schema.js';
import { eq, and } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { belief, beliefId, existingResponses } = await request.json();
	if (!belief || typeof belief !== 'string') throw error(400, 'Belief is required');

	const profile = await buildUserProfile(locals.user.id);
	const reflection = await assistOriginInquiry(profile, belief, existingResponses || []);

	if (beliefId) {
		await db
			.update(beliefs)
			.set({ aiReflection: reflection, updatedAt: new Date() })
			.where(and(eq(beliefs.id, beliefId), eq(beliefs.userId, locals.user.id)));
	}

	return json({ reflection });
};
