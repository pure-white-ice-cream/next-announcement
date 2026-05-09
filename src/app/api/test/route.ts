import { getCloudflareContext } from "@opennextjs/cloudflare";

type TestRecord = {
	id: number;
	name: string;
	updated_at: string;
};

type D1Env = CloudflareEnv & {
	next_announcement: D1Database;
};

function getDatabase() {
	const { env } = getCloudflareContext();
	return (env as D1Env).next_announcement;
}

async function ensureTestTable(db: D1Database) {
	await db
		.prepare(
			`
			CREATE TABLE IF NOT EXISTS test_records (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL UNIQUE,
				updated_at TEXT NOT NULL
			)
			`,
		)
		.run();
}

export async function POST() {
	try {
		const db = getDatabase();
		const now = new Date().toISOString();

		await ensureTestTable(db);

		await db
			.prepare(
				`
				INSERT INTO test_records (name, updated_at)
				VALUES (?, ?)
				ON CONFLICT(name) DO UPDATE SET updated_at = excluded.updated_at
				`,
			)
			.bind("test", now)
			.run();

		const record = await db
			.prepare("SELECT id, name, updated_at FROM test_records WHERE name = ?")
			.bind("test")
			.first<TestRecord>();

		return Response.json({
			ok: true,
			record,
		});
	} catch (error) {
		return Response.json(
			{
				ok: false,
				message: error instanceof Error ? error.message : "Unknown D1 error",
			},
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const db = getDatabase();

		await ensureTestTable(db);

		const record = await db
			.prepare("SELECT id, name, updated_at FROM test_records WHERE name = ?")
			.bind("test")
			.first<TestRecord>();

		return Response.json({
			ok: true,
			record,
		});
	} catch (error) {
		return Response.json(
			{
				ok: false,
				message: error instanceof Error ? error.message : "Unknown D1 error",
			},
			{ status: 500 },
		);
	}
}
