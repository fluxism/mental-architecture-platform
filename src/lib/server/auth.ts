import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from './db/index.js';
import { sessions, users } from './db/schema.js';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30; // 30 days
const SESSION_REFRESH_THRESHOLD = 1000 * 60 * 60 * 24 * 15; // 15 days

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	return encodeBase32LowerCaseNoPadding(bytes);
}

export function hashSessionToken(token: string): string {
	const encoded = new TextEncoder().encode(token);
	const hash = sha256(encoded);
	return encodeHexLowerCase(hash);
}

export async function createSession(userId: string): Promise<{ token: string; session: Session }> {
	const token = generateSessionToken();
	const id = hashSessionToken(token);
	const expiresAt = new Date(Date.now() + SESSION_DURATION);

	await db.insert(sessions).values({ id, userId, expiresAt });

	return { token, session: { id, userId, expiresAt } };
}

export async function validateSession(
	token: string
): Promise<{ session: Session; user: SessionUser } | null> {
	const id = hashSessionToken(token);
	const [result] = await db
		.select({
			session: sessions,
			user: { id: users.id, email: users.email, name: users.name, gender: users.gender, dateOfBirth: users.dateOfBirth, placeOfBirth: users.placeOfBirth }
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, id))
		.limit(1);

	if (!result) return null;

	const { session, user } = result;

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, id));
		return null;
	}

	// Refresh session if it's past the halfway point
	if (Date.now() >= session.expiresAt.getTime() - SESSION_REFRESH_THRESHOLD) {
		const newExpiresAt = new Date(Date.now() + SESSION_DURATION);
		await db.update(sessions).set({ expiresAt: newExpiresAt }).where(eq(sessions.id, id));
		session.expiresAt = newExpiresAt;
	}

	return { session, user };
}

export async function invalidateSession(token: string): Promise<void> {
	const id = hashSessionToken(token);
	await db.delete(sessions).where(eq(sessions.id, id));
}

export function setSessionCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export async function hashPassword(password: string): Promise<string> {
	// Use Web Crypto API for PBKDF2
	const encoder = new TextEncoder();
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const derivedBits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
		keyMaterial,
		256
	);
	const hash = new Uint8Array(derivedBits);
	const saltHex = encodeHexLowerCase(salt);
	const hashHex = encodeHexLowerCase(hash);
	return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
	const [saltHex, hashHex] = stored.split(':');
	const encoder = new TextEncoder();
	const salt = hexToBytes(saltHex);
	const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const derivedBits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100000, hash: 'SHA-256' },
		keyMaterial,
		256
	);
	const hash = encodeHexLowerCase(new Uint8Array(derivedBits));
	return hash === hashHex;
}

function hexToBytes(hex: string): Uint8Array {
	const bytes = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length; i += 2) {
		bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
	}
	return bytes;
}

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
};

export type SessionUser = {
	id: string;
	email: string;
	name: string | null;
	gender: 'male' | 'female' | null;
	dateOfBirth: string | null;
	placeOfBirth: string | null;
};
