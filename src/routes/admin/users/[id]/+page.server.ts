import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types.js';
import { db } from '$lib/server/db/index.js';
import {
	users,
	journalEntries,
	beliefs,
	stories,
	affirmations,
	reflections,
	lifeVisions,
	sessions
} from '$lib/server/db/schema.js';
import { eq, count, max, and, sql } from 'drizzle-orm';
import { hashPassword } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ params }) => {
	const [user] = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role,
			gender: users.gender,
			dateOfBirth: users.dateOfBirth,
			placeOfBirth: users.placeOfBirth,
			createdAt: users.createdAt
		})
		.from(users)
		.where(eq(users.id, params.id))
		.limit(1);

	if (!user) {
		error(404, 'User not found');
	}

	const [entryCount] = await db
		.select({ count: count(), lastDate: max(journalEntries.createdAt) })
		.from(journalEntries)
		.where(eq(journalEntries.userId, params.id));

	const beliefsByStatus = await db
		.select({ status: beliefs.status, count: count() })
		.from(beliefs)
		.where(eq(beliefs.userId, params.id))
		.groupBy(beliefs.status);

	const [storyCount] = await db
		.select({ count: count() })
		.from(stories)
		.where(eq(stories.userId, params.id));

	const [affirmationCount] = await db
		.select({ count: count() })
		.from(affirmations)
		.where(eq(affirmations.userId, params.id));

	const [reflectionCount] = await db
		.select({ count: count() })
		.from(reflections)
		.where(eq(reflections.userId, params.id));

	const [visionCount] = await db
		.select({ count: count() })
		.from(lifeVisions)
		.where(eq(lifeVisions.userId, params.id));

	const [sessionCount] = await db
		.select({ count: count() })
		.from(sessions)
		.where(and(eq(sessions.userId, params.id), sql`${sessions.expiresAt} > now()`));

	const beliefCounts = { active: 0, shifting: 0, integrated: 0 };
	for (const row of beliefsByStatus) {
		if (row.status in beliefCounts) {
			beliefCounts[row.status as keyof typeof beliefCounts] = row.count;
		}
	}

	return {
		targetUser: user,
		activity: {
			entries: entryCount?.count ?? 0,
			lastEntryDate: entryCount?.lastDate ?? null,
			beliefCounts,
			totalBeliefs: beliefCounts.active + beliefCounts.shifting + beliefCounts.integrated,
			stories: storyCount?.count ?? 0,
			affirmations: affirmationCount?.count ?? 0,
			reflections: reflectionCount?.count ?? 0,
			visions: visionCount?.count ?? 0,
			activeSessions: sessionCount?.count ?? 0
		}
	};
};

export const actions: Actions = {
	resetPassword: async ({ request, params }) => {
		const formData = await request.formData();
		const newPassword = formData.get('newPassword');

		if (!newPassword || typeof newPassword !== 'string') {
			return fail(400, { error: 'Password is required' });
		}

		if (newPassword.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		const passwordHash = await hashPassword(newPassword);

		await db
			.update(users)
			.set({ passwordHash, updatedAt: new Date() })
			.where(eq(users.id, params.id));

		// Invalidate all of this user's sessions
		await db.delete(sessions).where(eq(sessions.userId, params.id));

		return { success: true };
	}
};
