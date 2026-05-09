import { getCloudflareContext } from "@opennextjs/cloudflare";

export type McServerRow = {
	name: string;
	address: string;
	port: string | null;
};

type D1Env = CloudflareEnv & {
	next_announcement: D1Database;
};

function getDatabase() {
	const { env } = getCloudflareContext();
	return (env as D1Env).next_announcement;
}

export async function POST() {
	return Response.json(
		{
			ok: false,
			message: "此接口仅支持读取（GET）。",
		},
		{ status: 405 },
	);
}

export async function GET() {
	try {
		const db = getDatabase();

		const { results } = await db
			.prepare("SELECT name, address, port FROM mc ORDER BY rowid ASC")
			.all<McServerRow>();

		return Response.json({
			ok: true,
			rows: results ?? [],
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Unknown D1 error";

		// 只读模式下：如果表不存在，不创建表，直接视为“暂无公告”
		if (message.toLowerCase().includes("no such table")) {
			return Response.json({
				ok: true,
				rows: [],
			});
		}

		return Response.json(
			{
				ok: false,
				message,
			},
			{ status: 500 },
		);
	}
}
