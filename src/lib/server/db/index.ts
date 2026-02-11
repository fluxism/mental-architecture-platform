import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { env } from '$env/dynamic/private';
import * as schema from './schema.js';

let _db: NeonHttpDatabase<typeof schema>;

export function getDb() {
	if (!_db) {
		const sql = neon(env.NETLIFY_DATABASE_URL!);
		_db = drizzle(sql, { schema });
	}
	return _db;
}

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
	get(_target, prop) {
		return (getDb() as any)[prop];
	}
});
