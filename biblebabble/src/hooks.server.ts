import type { Handle } from '@sveltejs/kit';
import { validateSession, setSessionCookie, deleteSessionCookie } from '$lib/server/auth.js';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	if (!token) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const result = await validateSession(token);

	if (result) {
		setSessionCookie(event, token, result.session.expiresAt);
		event.locals.user = result.user;
		event.locals.session = result.session;
	} else {
		deleteSessionCookie(event);
		event.locals.user = null;
		event.locals.session = null;
	}

	return resolve(event);
};
