import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types.js';

export const load: LayoutServerLoad = async (event) => {
	if (!event.locals.user || event.locals.user.role !== 'admin') {
		redirect(302, '/dashboard');
	}
};
