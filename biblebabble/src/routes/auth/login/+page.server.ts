import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { createSession, verifyPassword, setSessionCookie } from '$lib/server/auth.js';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email')?.toString().trim() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		// Validate inputs
		if (!email || !password) {
			return fail(400, { email, error: 'Email and password are required.' });
		}

		// Look up user by email
		const user = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.get();

		if (!user) {
			return fail(400, { email, error: 'Invalid credentials.' });
		}

		// Verify password
		const valid = await verifyPassword(password, user.passwordHash);

		if (!valid) {
			return fail(400, { email, error: 'Invalid credentials.' });
		}

		// Create session and set cookie
		const { token, session } = await createSession(user.id);
		setSessionCookie(event, token, session.expiresAt);

		redirect(302, '/dashboard');
	}
};
