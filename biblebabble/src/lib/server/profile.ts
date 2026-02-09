import { db } from './db/index.js';
import {
	users,
	beliefs,
	beliefOrigins,
	journalEntries,
	stories,
	affirmations
} from './db/schema.js';
import { eq, desc } from 'drizzle-orm';
import type { UserProfile } from './ai.js';

export async function buildUserProfile(userId: string): Promise<UserProfile> {
	const user = await db.select().from(users).where(eq(users.id, userId)).get();

	const userBeliefs = await db
		.select()
		.from(beliefs)
		.where(eq(beliefs.userId, userId))
		.orderBy(desc(beliefs.createdAt));

	const beliefsWithOrigins = await Promise.all(
		userBeliefs.map(async (b) => {
			const origins = await db
				.select()
				.from(beliefOrigins)
				.where(eq(beliefOrigins.beliefId, b.id));
			return {
				statement: b.statement,
				status: b.status,
				functionalBelief: b.functionalBelief,
				origins: origins.map((o) => ({ question: o.question, response: o.response }))
			};
		})
	);

	const entries = await db
		.select({ content: journalEntries.content })
		.from(journalEntries)
		.where(eq(journalEntries.userId, userId))
		.orderBy(desc(journalEntries.createdAt))
		.limit(10);

	const userStories = await db
		.select({ title: stories.title })
		.from(stories)
		.where(eq(stories.userId, userId));

	const userAffirmations = await db
		.select({ content: affirmations.content })
		.from(affirmations)
		.where(eq(affirmations.userId, userId));

	return {
		name: user?.name || null,
		gender: (user?.gender as 'male' | 'female' | null) || null,
		beliefs: beliefsWithOrigins,
		journalExcerpts: entries.map((e) => e.content),
		existingStoryTitles: userStories.map((s) => s.title).filter(Boolean) as string[],
		affirmations: userAffirmations.map((a) => a.content)
	};
}
