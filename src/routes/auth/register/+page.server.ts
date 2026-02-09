import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { createSession, hashPassword, setSessionCookie } from '$lib/server/auth.js';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';
		const name = formData.get('name')?.toString().trim() || null;

		// Validate email
		if (!email) {
			return fail(400, { email, name, error: 'Email is required.' });
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return fail(400, { email, name, error: 'Please enter a valid email address.' });
		}

		// Validate password
		if (!password) {
			return fail(400, { email, name, error: 'Password is required.' });
		}

		if (password.length < 8) {
			return fail(400, { email, name, error: 'Password must be at least 8 characters.' });
		}

		// Check if email already exists
		const [existing] = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existing) {
			return fail(400, { email, name, error: 'An account with this email already exists.' });
		}

		// Create user
		const userId = nanoid();
		const passwordHash = await hashPassword(password);
		const now = new Date();

		await db.insert(users).values({
			id: userId,
			email,
			passwordHash,
			name,
			createdAt: now,
			updatedAt: now
		});

		// Create session and set cookie
		const { token, session } = await createSession(userId);
		setSessionCookie(event, token, session.expiresAt);

		redirect(302, '/dashboard');
	}
};
