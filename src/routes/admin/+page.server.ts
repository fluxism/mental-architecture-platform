import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import {
	users,
	journalEntries,
	beliefs,
	stories,
	sessions
} from '$lib/server/db/schema.js';
import { eq, count, sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
	const allUsers = await db
		.select({
			id: users.id,
			name: users.name,
			email: users.email,
			role: users.role,
			gender: users.gender,
			createdAt: users.createdAt
		})
		.from(users)
		.orderBy(users.createdAt);

	const entryCounts = await db
		.select({ userId: journalEntries.userId, count: count() })
		.from(journalEntries)
		.groupBy(journalEntries.userId);

	const beliefCounts = await db
		.select({ userId: beliefs.userId, count: count() })
		.from(beliefs)
		.groupBy(beliefs.userId);

	const storyCounts = await db
		.select({ userId: stories.userId, count: count() })
		.from(stories)
		.groupBy(stories.userId);

	const sessionCounts = await db
		.select({ userId: sessions.userId, count: count() })
		.from(sessions)
		.where(sql`${sessions.expiresAt} > now()`)
		.groupBy(sessions.userId);

	const entryMap = Object.fromEntries(entryCounts.map((r) => [r.userId, r.count]));
	const beliefMap = Object.fromEntries(beliefCounts.map((r) => [r.userId, r.count]));
	const storyMap = Object.fromEntries(storyCounts.map((r) => [r.userId, r.count]));
	const sessionMap = Object.fromEntries(sessionCounts.map((r) => [r.userId, r.count]));

	const usersWithCounts = allUsers.map((u) => ({
		...u,
		entries: entryMap[u.id] ?? 0,
		beliefs: beliefMap[u.id] ?? 0,
		stories: storyMap[u.id] ?? 0,
		activeSessions: sessionMap[u.id] ?? 0
	}));

	const totalEntries = entryCounts.reduce((sum, r) => sum + r.count, 0);
	const totalBeliefs = beliefCounts.reduce((sum, r) => sum + r.count, 0);
	const totalStories = storyCounts.reduce((sum, r) => sum + r.count, 0);

	return {
		users: usersWithCounts,
		stats: {
			totalUsers: allUsers.length,
			totalEntries,
			totalBeliefs,
			totalStories
		}
	};
};
