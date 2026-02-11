import { db } from './db/index.js';
import {
	users,
	beliefs,
	beliefOrigins,
	journalEntries,
	stories,
	affirmations
} from './db/schema.js';
import { eq, desc, inArray } from 'drizzle-orm';
import type { UserProfile } from './ai.js';

export async function buildUserProfile(userId: string): Promise<UserProfile> {
	const [userResult, userBeliefs, entries, userStories, userAffirmations] = await Promise.all([
		db.select().from(users).where(eq(users.id, userId)).limit(1),
		db.select().from(beliefs).where(eq(beliefs.userId, userId)).orderBy(desc(beliefs.createdAt)),
		db
			.select({ content: journalEntries.content })
			.from(journalEntries)
			.where(eq(journalEntries.userId, userId))
			.orderBy(desc(journalEntries.createdAt))
			.limit(10),
		db.select({ title: stories.title }).from(stories).where(eq(stories.userId, userId)),
		db
			.select({ content: affirmations.content })
			.from(affirmations)
			.where(eq(affirmations.userId, userId))
	]);

	const user = userResult[0];
	const beliefIds = userBeliefs.map((b) => b.id);
	const allOrigins =
		beliefIds.length > 0
			? await db.select().from(beliefOrigins).where(inArray(beliefOrigins.beliefId, beliefIds))
			: [];

	const originsByBelief = new Map<string, (typeof allOrigins)[number][]>();
	for (const o of allOrigins) {
		if (!originsByBelief.has(o.beliefId)) originsByBelief.set(o.beliefId, []);
		originsByBelief.get(o.beliefId)!.push(o);
	}

	const beliefsWithOrigins = userBeliefs.map((b) => ({
		statement: b.statement,
		status: b.status,
		functionalBelief: b.functionalBelief,
		origins: (originsByBelief.get(b.id) || []).map((o) => ({
			question: o.question,
			response: o.response
		}))
	}));

	return {
		name: user?.name || null,
		gender: (user?.gender as 'male' | 'female' | null) || null,
		dateOfBirth: user?.dateOfBirth || null,
		placeOfBirth: user?.placeOfBirth || null,
		beliefs: beliefsWithOrigins,
		journalExcerpts: entries.map((e) => e.content),
		existingStoryTitles: userStories.map((s) => s.title).filter(Boolean) as string[],
		affirmations: userAffirmations.map((a) => a.content)
	};
}
