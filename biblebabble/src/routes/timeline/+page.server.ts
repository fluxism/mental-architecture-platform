import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import {
	journalEntries,
	beliefs,
	affirmations,
	stories,
	reflections
} from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

type TimelineEvent = {
	type: 'journal' | 'belief' | 'affirmation' | 'story' | 'reflection';
	id: string;
	title: string;
	preview: string;
	date: Date;
	linkedId?: string;
	status?: string;
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	const userId = locals.user.id;

	const [entries, userBeliefs, userAffirmations, userStories, userReflections] = await Promise.all([
		db.select().from(journalEntries).where(eq(journalEntries.userId, userId)),
		db.select().from(beliefs).where(eq(beliefs.userId, userId)),
		db.select().from(affirmations).where(eq(affirmations.userId, userId)),
		db.select().from(stories).where(eq(stories.userId, userId)),
		db.select().from(reflections).where(eq(reflections.userId, userId))
	]);

	const events: TimelineEvent[] = [
		...entries.map((e) => ({
			type: 'journal' as const,
			id: e.id,
			title: 'Journal Entry',
			preview: e.content.slice(0, 120) + (e.content.length > 120 ? '...' : ''),
			date: e.createdAt
		})),
		...userBeliefs.map((b) => ({
			type: 'belief' as const,
			id: b.id,
			title: 'Belief Identified',
			preview: b.statement,
			date: b.createdAt,
			status: b.status
		})),
		...userAffirmations.map((a) => ({
			type: 'affirmation' as const,
			id: a.id,
			title: 'Affirmation Created',
			preview: a.content.slice(0, 120),
			date: a.createdAt,
			linkedId: a.beliefId
		})),
		...userStories.map((s) => ({
			type: 'story' as const,
			id: s.id,
			title: s.title || 'Mythic Story',
			preview: s.content.slice(0, 120) + '...',
			date: s.createdAt,
			linkedId: s.beliefId
		})),
		...userReflections.map((r) => ({
			type: 'reflection' as const,
			id: r.id,
			title: 'Reflection',
			preview: r.content.slice(0, 120),
			date: r.createdAt,
			linkedId: r.beliefId || r.journalEntryId || undefined
		}))
	];

	events.sort((a, b) => b.date.getTime() - a.date.getTime());

	return { events };
};
