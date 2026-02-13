import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { aiFeedback } from '$lib/server/db/schema.js';
import { nanoid } from 'nanoid';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	const { sourceType, sourceId, aiOutput, feedback } = await request.json();
	if (!sourceType || !sourceId || !aiOutput || !feedback?.trim()) {
		throw error(400, 'All fields are required');
	}

	await db.insert(aiFeedback).values({
		id: nanoid(),
		userId: locals.user.id,
		sourceType,
		sourceId,
		aiOutput,
		feedback: feedback.trim(),
		createdAt: new Date()
	});

	return json({ saved: true });
};
