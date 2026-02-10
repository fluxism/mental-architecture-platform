import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/server/auth.js';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/auth/login');

	return { user: locals.user };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() || null;
		const gender = formData.get('gender')?.toString() as 'male' | 'female' | null;
		const dateOfBirth = formData.get('dateOfBirth')?.toString().trim() || null;
		const placeOfBirth = formData.get('placeOfBirth')?.toString().trim() || null;

		if (gender && gender !== 'male' && gender !== 'female') {
			return fail(400, { profileError: 'Invalid gender value.' });
		}

		await db
			.update(users)
			.set({ name, gender: gender || null, dateOfBirth, placeOfBirth, updatedAt: new Date() })
			.where(eq(users.id, locals.user.id));

		return { profileSaved: true };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) throw redirect(302, '/auth/login');

		const formData = await request.formData();
		const currentPassword = formData.get('currentPassword')?.toString() ?? '';
		const newPassword = formData.get('newPassword')?.toString() ?? '';

		if (!currentPassword) {
			return fail(400, { passwordError: 'Current password is required.' });
		}

		if (!newPassword || newPassword.length < 8) {
			return fail(400, { passwordError: 'New password must be at least 8 characters.' });
		}

		const [user] = await db
			.select({ passwordHash: users.passwordHash })
			.from(users)
			.where(eq(users.id, locals.user.id))
			.limit(1);

		if (!user) {
			return fail(400, { passwordError: 'User not found.' });
		}

		const valid = await verifyPassword(currentPassword, user.passwordHash);
		if (!valid) {
			return fail(400, { passwordError: 'Current password is incorrect.' });
		}

		const passwordHash = await hashPassword(newPassword);
		await db
			.update(users)
			.set({ passwordHash, updatedAt: new Date() })
			.where(eq(users.id, locals.user.id));

		return { passwordChanged: true };
	}
};
